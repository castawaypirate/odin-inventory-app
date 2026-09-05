import { Router } from "express";
import { getIndex, createForm, updateForm, createGame, updateGame } from "../controllers/gameController.js";


const indexRouter = Router();

indexRouter.get("/", getIndex);

indexRouter.get("/create", createForm);

indexRouter.get("/update/:gameId", updateForm);

indexRouter.post("/create", createGame)

indexRouter.post("/update/:gameId", updateGame)

export default indexRouter;
