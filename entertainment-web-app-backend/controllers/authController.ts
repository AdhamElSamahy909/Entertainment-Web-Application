import { NextFunction, Response } from "express";
import {
  DecodedToken,
  IAuthRequest,
  JwtPayload,
  User as UserType,
} from "../utils/types.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import {
  blockToken,
  getCache,
  isTokenBlocked,
  setCache,
} from "../utils/cacheServices.js";

function createSendAccessJWT(id: string, email: string, res: Response) {
  const accessToken = jwt.sign(
    {
      id,
      email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return accessToken;
}

function createSendRefreshJWT(id: string, email: string, res: Response) {
  const refreshToken = jwt.sign(
    {
      id,
      email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return refreshToken;
}

function sendAuthCredentials(
  req: IAuthRequest,
  res: Response,
  accessToken: string,
) {
  const { isMobile } = req.body;

  const responsePayload = {
    message: "Logged In Successfully",
    user: req.user,
    accessToken: isMobile ? accessToken : undefined,
  };

  res.status(200).json(responsePayload);
}

async function updateUserRefreshTokens(
  user: InstanceType<typeof User>,
  refreshToken: string,
  deviceIdentifier: string,
) {
  await User.updateOne(
    { _id: user.id },
    { $pull: { refreshTokens: { device: deviceIdentifier } } },
  );

  await User.updateOne(
    { _id: user.id },
    {
      $push: {
        refreshTokens: { token: refreshToken, device: deviceIdentifier },
      },
    },
  );
}

function attachUserToRequest(
  req: IAuthRequest,
  user: InstanceType<typeof User>,
) {
  req.user = {};
  req.user.id = user.id;
  req.user.email = user.email;
  req.user.bookmarks = user.bookmarks;
}

async function setUserToCache(user: InstanceType<typeof User>) {
  await setCache(
    `user:${user.id}`,
    JSON.stringify({
      id: user.id,
      email: user.email,
      bookmarks: user.bookmarks,
    }),
    3600,
  );
}

export const signup = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409).json({ message: "Email is already in use" });
  }

  const oldAccessToken = req.cookies?.accessToken;
  if (oldAccessToken) {
    try {
      const decoded = (jwt.decode(oldAccessToken) as DecodedToken) || null;
      if (decoded && decoded.exp) {
        await blockToken(oldAccessToken, decoded.exp);
      }
    } catch (err) {
      console.log("Error blacklisting old access token: ", oldAccessToken);
    }
  }

  const newUser = await User.create({
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  const deviceIdentifier = req.headers["user-agent"] || "unknown";

  const accessToken = createSendAccessJWT(newUser.id, newUser.email, res);
  const refreshToken = createSendRefreshJWT(newUser.id, newUser.email, res);

  try {
    await updateUserRefreshTokens(newUser, refreshToken, deviceIdentifier);

    await setUserToCache(newUser);

    sendAuthCredentials(req, res, accessToken);
  } catch (error) {
    console.log(
      "Error storing the refresh Token: ",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const login = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const oldAccessToken = req.cookies?.accessToken;
  if (oldAccessToken) {
    try {
      const decoded = (jwt.decode(oldAccessToken) as DecodedToken) || null;
      if (decoded?.exp) {
        await blockToken(oldAccessToken, decoded.exp);
      }
    } catch (err) {
      console.log("Error blacklisting old access token: ", oldAccessToken);
    }
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email });

  console.log(foundUser);

  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) res.status(401).json({ message: "Unauthorized" });

    const deviceIdentifier = req.headers["user-agent"] || "unknown";

    const accessToken = createSendAccessJWT(foundUser.id, foundUser.email, res);
    const refreshToken = createSendRefreshJWT(
      foundUser.id,
      foundUser.email,
      res,
    );

    try {
      await updateUserRefreshTokens(foundUser, refreshToken, deviceIdentifier);

      setUserToCache(foundUser);

      attachUserToRequest(req, foundUser);

      const cachedUser = await getCache(`user:${foundUser.id}`);

      if (!cachedUser) await setUserToCache(foundUser);

      sendAuthCredentials(req, res, accessToken);
    } catch (error) {
      console.log(
        "Error storing the refresh Token: ",
        error instanceof Error ? error.message : error,
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

export const refresh = asyncHandler(
  async (req: IAuthRequest, res: Response) => {
    let refreshToken;
    if (req.body?.refreshToken) {
      refreshToken = req.body.refreshToken;
    } else {
      refreshToken = req.cookies?.refreshToken;
    }

    console.log("Refresh Token Sending Refreshing Request: ", refreshToken);

    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const foundUser = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (!foundUser) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as JwtPayload;

      if (!foundUser || foundUser.id !== decoded.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      attachUserToRequest(req, foundUser);

      const accessToken = createSendAccessJWT(
        foundUser.id,
        foundUser.email,
        res,
      );
      sendAuthCredentials(req, res, accessToken);
    } catch (err) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  },
);

export const logout = asyncHandler(async (req: IAuthRequest, res: Response) => {
  let accessToken;
  let refreshToken;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.split(" ")[1];
  } else {
    accessToken = req.cookies?.accessToken;
  }

  if (req.cookies?.refreshToken) {
    refreshToken = req.cookies?.refreshToken;
  } else if (req.body?.refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (accessToken) {
    const decodedToken = jwt.decode(accessToken) as DecodedToken;
    if (!decodedToken || !decodedToken.exp) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      res.sendStatus(204);
    }
    console.log("Here is the decodedToken: ", decodedToken);
    const expirationDate = decodedToken.exp;
    try {
      await blockToken(accessToken, expirationDate);
    } catch (error) {
      console.log("Error blacklisting token in Redis: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (!refreshToken) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.sendStatus(204);
  }

  try {
    await User.updateOne(
      { "refreshTokens.token": refreshToken },
      { $pull: { refreshTokens: { token: refreshToken } } },
    );
    console.log("Removing current refresh token from DB");
  } catch (error) {
    console.log("Error invalidating refresh token in DB: ", error);
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  req.user = undefined;

  res.status(200).json({ message: "Logged Out Successfully" });
});

export const verifyJwt = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    console.log("🔒 VerifyJWT is running for URL:", req.originalUrl);
    let token;

    console.log("Request Authorization Headers: ", req.headers.authorization);
    console.log("Request Cookies: ", req.cookies);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    else if (req.cookies && req.cookies.accessToken)
      token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    if (token) {
      try {
        const isBlackListed = await isTokenBlocked(token);
        if (isBlackListed) {
          res
            .status(403)
            .json({ message: "Forbidden: token has been invalidated" });
          return;
        }
      } catch (err) {
        console.log("Error checking token in Redis: ", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as DecodedToken;
    } catch (error) {
      console.log("Error verifying token: ", error);
      res.status(401).json({ message: "Not authorized, invalid token" });
      return;
    }

    try {
      const cachedUser = await getCache(`user:${decoded.id}`);

      if (cachedUser) {
        req.user = JSON.parse(cachedUser);

        return next();
      }

      const userFromDb = await User.findById(decoded.id).select(
        "bookmarks email id",
      );

      if (!userFromDb) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      attachUserToRequest(req, userFromDb);
      await setUserToCache(userFromDb);

      return next();
    } catch (error) {
      console.log("Auth middleware error: ", error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  },
);

export const checkSessionStatus = (req: IAuthRequest, res: Response) => {
  res.status(200).json({ valid: true, user: req.user });
  return;
};
