// This imports AND configures dotenv simultaneously,
// meaning that this line replaces these two:
// import dotenv from "dotenv";
// dotenv.config();
// import "dotenv/config";

import express from "express";
import methodOverride from "method-override";
import session from "express-session";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import indexRouter from "./routes/indexRoute.js";
import { clean_up } from "./jobs/clean_up.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

app.use(favicon(path.join(__dirname, "favicon.ico")));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600000,
    },
  }),
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Running on Node version: ${process.version}`);
  console.log(`App listening at port: ${port}`);
});

cron.schedule("* * * * *", async () => {
  await clean_up(`${__dirname}/public/uploads/images/`);
});
