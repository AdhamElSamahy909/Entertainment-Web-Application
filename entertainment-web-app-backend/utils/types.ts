import { Request } from "express";
import mongoose from "mongoose";

export interface IAuthRequest extends Request {
  user?: {
    id?: string;
    email?: string;
    bookmarks?: mongoose.Types.ObjectId[];
  };
}

export interface User {
  id: string;
  bookmarks: mongoose.Schema.Types.ObjectId[];
}

export interface JwtPayload {
  id: string;
  email: string;
}

export interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AppError extends Error {
  statusCode: number;
  status: string;
}
