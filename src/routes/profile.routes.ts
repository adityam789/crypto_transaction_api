import { NextFunction, Router, Request, Response } from "express";
import passport from "passport";
import ProfileController from "../controllers/profile.controller";

const profileController = new ProfileController();

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", profileController.getProfile);

export default router;
