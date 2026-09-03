import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import indexRouter from "./routes/indexRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

app.use(favicon(path.join(__dirname, "favicon.ico")));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
})

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Running on Node version: ${process.version}`);
  console.log(`App listening at port: ${port}`);
})
