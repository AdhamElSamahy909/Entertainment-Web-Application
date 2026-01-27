import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import movieTVSeriesRouter from "./routes/movieTVSeriesRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(hpp());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming request:", {
    method: req.method,
    url: req.url,
    query: req.query,
  });
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use("/api/v1/moviesTVSeries", movieTVSeriesRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
