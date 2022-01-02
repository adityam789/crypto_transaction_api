import { NextFunction, Router, Request, Response } from "express";
import PricingController from "../controllers/pricing.controller";

const pricingController = new PricingController();

const router = Router();

router.get("/:coin_pair", pricingController.getPricing);
router.get("/:product_id/candles", pricingController.getCandlestickData);

export default router;
