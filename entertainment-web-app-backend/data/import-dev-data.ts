import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MovieTVSeries from "../models/movieTVSeriesModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./config.env" });

const DB = (process.env.DATABASE as string)
  .replace("<username>", process.env.DATABASE_USERNAME as string)
  .replace("<password>", process.env.DATABASE_PASSWORD as string);

mongoose.connect(DB).then(() => console.log("DB connected"));

const moviesTVSeries = JSON.parse(
  fs.readFileSync(`${__dirname}/data.json`, "utf-8"),
);

const emptyDB = async () => {
  try {
    await MovieTVSeries.deleteMany({});
    console.log("DB emptied");
  } catch (error) {
    console.log(error);
  }
};

const importData = async () => {
  try {
    await MovieTVSeries.create(moviesTVSeries);
    console.log("Data loaded");
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

await emptyDB();
importData();
