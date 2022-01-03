import { NextFunction, Router, Request, Response } from "express";
import passport from "passport";
import ApiKeyController from "../controllers/ApiKey.controller";
import { passport_token_handler } from "../controllers/passport.controller";
import scopeHandler from "../middleware/scopes.middleware";

const router = Router();
const apiKeyController = new ApiKeyController()

router.get("/", passport.authenticate("api", { session: false }), passport_token_handler)

router.use(passport.authenticate("jwt", { session: false }));

router.post("/",scopeHandler("apikey.create"), apiKeyController.create)
router.get("/roll/:key_id", scopeHandler("apikey.rollkey"), apiKeyController.rollKey)

router.get("/all", scopeHandler("apikey.get"), apiKeyController.get)
router.delete("/:key_id", scopeHandler("apikey.delete"), apiKeyController.delete)


export default router;
