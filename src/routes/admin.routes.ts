import { NextFunction, Router, Request, Response } from "express";
import AdminController from "../controllers/admin.controller";
import scopeHandler from "../middleware/scopes.middleware";


const router = Router();

const adminController = new AdminController();

router.get("/get-id-discord", scopeHandler("admin"), adminController.get_id_discord);

export default router;
