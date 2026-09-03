import { Router } from "express";
import { getIndex } from "../controllers/gameController.js";


const indexRouter = Router();

indexRouter.get("/", getIndex);


export default indexRouter;
