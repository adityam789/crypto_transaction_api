import { NextFunction, Router, Request, Response } from "express";
import passport from "passport";
import ApiKeyController from "../controllers/ApiKey.controller";
import { passport_token_handler } from "../controllers/passport.controller";

const router = Router();
const apiKeyController = new ApiKeyController()

router.get("/", passport.authenticate("api", { session: false }), passport_token_handler)

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", apiKeyController.create)
router.get("/roll/:key_id", apiKeyController.rollKey)

router.get("/all", apiKeyController.get)
router.delete("/:key_id", apiKeyController.delete)


export default router;
