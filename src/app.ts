import express from "express";

import helmet from "helmet";
import passport from "./controllers/passport.controller";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import * as dotenv from "dotenv";

import routes from "./routes";
import { connect } from "mongoose";

dotenv.config();

const app = express();

async function connectToDB() {
  await connect(process.env.MONGO_URI as string).then(() => {
    console.log("Connected to DB");
  });
}

connectToDB();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(routes);

export default app;
