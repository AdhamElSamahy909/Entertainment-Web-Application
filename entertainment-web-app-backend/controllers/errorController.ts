import { ErrorRequestHandler, Response } from "express";
import { AppError } from "../utils/types.js";

const sendErrorDev = (err: AppError, res: Response) => {
  console.log(err);

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};

export default globalErrorHandler;
