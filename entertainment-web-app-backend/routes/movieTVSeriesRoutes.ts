import express from "express";

import * as MovieTVSeriesController from "../controllers/movieTVSeriesController.js";
import * as authController from "../controllers/authController.js";

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
