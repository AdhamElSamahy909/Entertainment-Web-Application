import express from "express";

import * as MovieTVSeriesController from "../controllers/movieTVSeriesController";
import * as authController from "../controllers/authController";

const router = express.Router();

router.use(authController.verifyJwt);

router
  .route("/")
  .get(MovieTVSeriesController.getAllMoviesTVSeries)
  .post(MovieTVSeriesController.createMovieTVSeries);

router.route("/search").get(MovieTVSeriesController.search);

router
  .route("/:id")
  .get(MovieTVSeriesController.getMovieTVSeries)
  .post(MovieTVSeriesController.updateMovieTVSeries)
  .delete(MovieTVSeriesController.deleteMovieTVSeries);

export default router;
