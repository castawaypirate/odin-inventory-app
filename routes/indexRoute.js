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
  verifyPasswordUpdate,
  verifyPasswordCreate,
} from "../controllers/gameController.js";

const indexRouter = Router();
const upload = multer({ dest: process.env.UPLOAD_DIR });

indexRouter.get("/", getIndex);

indexRouter.get("/create", getIndex);

indexRouter.post("/create/verify", verifyPasswordCreate);

indexRouter.get("/game/create", createForm);

indexRouter.post("/game/create", upload.single("game_cover"), createGame);

indexRouter.get("/game/update/:gameId", updateForm);

indexRouter.put(
  "/game/update/:gameId",
  upload.single("game_cover"),
  updateGame,
);

indexRouter.get("/game/:gameId", getGameDetails);

indexRouter.get("/game/:gameId/:action", getGameDetails);

indexRouter.post("/game/:gameId/verify", verifyPasswordUpdate);

indexRouter.delete("/game/:gameId", removeGame);

export default indexRouter;
