import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/catchAsync";
import MovieTVSeries from "../models/movieTVSeriesModel";
import asyncHandler from "express-async-handler";

export const getAllMoviesTVSeries = async (req: Request, res: Response) => {
  try {
    const data = await MovieTVSeries.find().lean().select("-__v");

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ status: "fail", message: error });
  }
};

export const getMovieTVSeries = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await MovieTVSeries.findById(req.params.id)
      .lean()
      .select("-__v");

    if (!data) {
      res.status(404);
      throw new Error("No movie found with that ID");
    }

    res.status(200).json(data);
    return;
  }
);

export const search = catchAsync(async (req: Request, res: Response) => {
  console.log("Search: ", req.query);
  let data;
  if (req.query.type != "isBookmarked")
    data = await MovieTVSeries.find({
      title: { $regex: req.query.search, $options: "i" },
      category: {
        $regex: `^${req.query.type}`,
        $options: "i",
      },
    });
  else
    data = await MovieTVSeries.find({
      title: { $regex: req.query.search, $options: "i" },
      isBookmarked: { $eq: true },
    })
      .lean()
      .select("-__v");

  res.status(200).json(data);
  return;
});

export const updateMovieTVSeries = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await MovieTVSeries.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) return next(new Error("That show does not exist"));

    res.status(200).json({ status: "success", data });
  }
);

export const createMovieTVSeries = async (req: Request, res: Response) => {
  try {
    const data = await MovieTVSeries.create(req.body);

    res.status(200).json({
      status: "success",
      data,
    });
    return;
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
    return;
  }
};

export const deleteMovieTVSeries = async (req: Request, res: Response) => {
  try {
    await MovieTVSeries.deleteOne({ _id: req.params.id });

    res.status(204).json({
      status: "success",
      data: null,
    });
    return;
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
    return;
  }
};
