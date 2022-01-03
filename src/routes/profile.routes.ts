import { NextFunction, Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import passport from "passport";
import ProfileController from "../controllers/profile.controller";
import scopeHandler from "../middleware/scopes.middleware";

const profileController = new ProfileController();

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", scopeHandler("profile.get"), profileController.getProfile);

export default router;
