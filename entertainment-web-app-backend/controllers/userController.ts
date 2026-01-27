import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import MovieTVSeries from "../models/movieTVSeriesModel.js";
import redisClient from "../config/redisConfig.js";
import { Response } from "express";
import { IAuthRequest } from "../utils/types.js";

export const getBookmarks = asyncHandler(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (userId === undefined) {
      res.status(400).json({ message: "User ID is missing in the request" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(userId).populate("bookmarks");

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    } else {
      res.status(200).json(user.bookmarks);
      return;
    }
  },
);

export const addBookmark = asyncHandler(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { showId } = req.params;

    if (!showId) {
      res
        .status(400)
        .json({ message: "Show ID is required in the request parameters" });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId as string) ||
      !mongoose.Types.ObjectId.isValid(showId)
    ) {
      res.status(400).json({ message: "Invalid user or show ID format" });
      return;
    }

    const [user, show] = await Promise.all([
      User.findById(userId),
      MovieTVSeries.findById(showId),
    ]);

    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!show) {
      res.status(404).json({ message: "Show not found" });
      return;
    }

    const alreadyBookmarked = user?.bookmarks?.some((bookmarkId) =>
      bookmarkId.equals(showId),
    );

    if (alreadyBookmarked) {
      res
        .status(200)
        .json({ message: "This show is already bookmarked by the user" });
      return;
    }

    user?.bookmarks?.push(new mongoose.Types.ObjectId(showId));
    await user.save();

    await redisClient.del(`user:${userId}`);

    res.status(200).json({
      message: `Show ${show.title} is added to the bookmarks of user ${user.email}`,
      newShow: show,
    });
  },
);

export const removeBookmark = asyncHandler(
  async (req: IAuthRequest, res: Response) => {
    const { showId } = req.params;
    const userId = req.user?.id;

    if (!showId) {
      res
        .status(400)
        .json({ message: "Show ID is required in the request parameters" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "User ID is missing in the request" });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(showId)
    ) {
      res.status(400).json({ message: "Invalid user or show ID format" });
      return;
    }

    const [user, show] = await Promise.all([
      User.findById(userId),
      MovieTVSeries.findById(showId),
    ]);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!show) {
      res.status(404).json({ message: "Show not found" });
      return;
    }

    if (!user?.bookmarks?.some((bookmarkId) => bookmarkId.equals(showId))) {
      res
        .status(400)
        .json({ message: "This show is not bookmarked by the user" });
      return;
    }

    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== showId,
    );
    await user.save();

    await redisClient.del(`user:${userId}`);

    res.status(200).json({
      message: `Show ${show?.title} is removed from the bookmarks of user ${user.email}`,
    });
  },
);
