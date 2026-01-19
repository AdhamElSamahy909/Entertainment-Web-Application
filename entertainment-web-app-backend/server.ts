import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import app from "./app";

const DB = process.env.DATABASE_USERNAME
  ? (process.env.DATABASE as string)
      .replace("<username>", process.env.DATABASE_USERNAME)
      .replace("<password>", process.env.DATABASE_PASSWORD as string)
  : (process.env.DATABASE as string);

mongoose.connect(DB).then(() => console.log("DB connected"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
