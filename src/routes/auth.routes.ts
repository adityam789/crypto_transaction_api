import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import passport from "passport";
import { passport_token_handler } from "../controllers/passport.controller";

const router = Router();

const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

router.get("/verify/:token", authController.verify);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  passport_token_handler
);

router.get(
  "/discord",
  passport.authenticate("discord", {
    scope: ["identify", "email"],
    session: false,
  })
);
router.get(
  "/discord/callback",
  passport.authenticate("discord", { session: false }),
  passport_token_handler
);

export default router;
