import { Router } from "express";
import multer from "multer";
import {
  getIndex,
  getGameDetails,
  createForm,
  updateForm,
  createGame,
  updateGame,
  removeGame,
} from "../controllers/gameController.js";

const indexRouter = Router();
const upload = multer({ dest: process.env.UPLOAD_DIR });

indexRouter.get("/", getIndex);

indexRouter.get("/game/:gameId", getGameDetails);

indexRouter.get("/create", createForm);

indexRouter.get("/update/:gameId", updateForm);

indexRouter.post("/create", upload.single("game_cover"), createGame);

indexRouter.put("/update/:gameId", upload.single("game_cover"), updateGame);

indexRouter.get("/game/:gameId/:action", getGameDetails);

indexRouter.delete("/game/:gameId", removeGame);

export default indexRouter;
