import { Request, Response, NextFunction } from "express";

import PricingService from "../services/pricing.service";

const pricingService = new PricingService();

export default class PricingController {
  public getPricing(req: Request, res: Response, next: NextFunction) {
    const spot = req.params.spot;
    console.log(spot);
    console.log(pricingService);
    pricingService
      .getPricingFromCoinbase(spot)
      .then((pricing) => res.json(pricing))
      .catch(next);
  }

  public getCandlestickData(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id;
    const start = req.query.start as string;
    const end = req.query.end as string;
    const granularity = parseInt(req.query.granularity as string);
    pricingService
      .getCandlestickDataFromCoinbase(product_id, start, end, granularity)
      .then((data) => res.json(data))
      .catch(next);
  }
}
