import { NextFunction, Router, Request, Response } from "express";
import RootController from "../controllers/root.controller";
import scopeHandler from "../middleware/scopes.middleware";

const router = Router();

const rootController = new RootController()

router.get("/", rootController.index);

export default router;
