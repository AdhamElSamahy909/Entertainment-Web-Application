import { Request, Response, NextFunction } from "express";
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 seconds pause",
    handler: (
      req: Request,
      res: Response,
      next: NextFunction,
      options: any
    ) => {
      res.status(options.statusCode).send(options.message);
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
