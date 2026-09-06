import { Router } from "express";
import multer from "multer";
import {
  getIndex,
  createForm,
  updateForm,
  createGame,
  updateGame,
} from "../controllers/gameController.js";

const indexRouter = Router();
const upload = multer({ dest: process.env.UPLOAD_DIR });

indexRouter.get("/", getIndex);

indexRouter.get("/create", createForm);

indexRouter.get("/update/:gameId", updateForm);

indexRouter.post("/create", upload.single("game_cover"), createGame);

indexRouter.post("/update/:gameId", updateGame);

export default indexRouter;
