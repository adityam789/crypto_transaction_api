import { Request, Response, NextFunction } from "express";

import ExchangeService from "../services/exchange.service";
import PricingService from "../services/pricing.service";

const exchangeService = new ExchangeService();
const pricingService = new PricingService();

export default class ExchangeController {
  public async buyOrder(req: Request, res: Response, next: NextFunction) {
    try{
      const wallet_id_with = req.body.wallet_id_with;
      const wallet_id_to = req.body.wallet_id_to;
      const coin_to_sell = req.body.coin_to_sell;
      const coin_to_buy = req.body.coin_to_buy;
      const coin_to_buy_amount = parseFloat(req.body.coin_to_buy_amount);
      const coin_to_sell_amount = parseFloat(req.body.coin_to_sell_amount);

      if (coin_to_buy_amount && coin_to_sell_amount) {
        return res.json({
          success: false,
          message:
            "Too many parameters. Only mention either coin_to_buy_amount or coin_to_sell_amount.",
        });
      }

      const errors: string[] = [];

      if (!wallet_id_with) errors.push("wallet_id_with is required");
      if (!wallet_id_to) errors.push("wallet_id_to is required");
      if (!coin_to_buy) errors.push("coin_to_buy is required");
      if (!coin_to_sell) errors.push("coin_to_sell is required");
      if (!coin_to_buy_amount && !coin_to_sell_amount)
        errors.push("coin_to_buy_amount or coin_to_sell_amount is required");

      if (errors.length) {
        return res.json({
          success: false,
          message: errors.join(", "),
        });
      }

      const amount =
        coin_to_buy_amount ||
        parseFloat((await pricingService.getPricingFromCoinbase(coin_to_buy, coin_to_sell)).amount) *
          coin_to_sell_amount;

      console.log("AMOUNT", amount);
      exchangeService
        .buy(coin_to_sell, coin_to_buy, amount, wallet_id_with, wallet_id_to)
        .then((data) => res.json(data)).catch((err) => {throw err});
    } catch(err:any){
      res.json({
        success: false,
        message: err.message,
      });
    }
  }

  public async sellOrder(req: Request, res: Response, next: NextFunction) {
    const wallet_id_with = req.params.wallet_id_with;
    const wallet_id_to = req.params.wallet_id_to;
    const coin_to_recieve = req.params.coin_to_recieve;
    const coin_to_sell = req.params.coin_to_sell;
    const coin_to_recieve_amount = parseFloat(
      req.params.coin_to_recieve_amount
    );
    const coin_to_sell_amount = parseFloat(req.params.coin_to_sell_amount);

    if (coin_to_recieve_amount && coin_to_sell_amount) {
      return res.json({
        success: false,
        message:
          "Too many parameters. Only mention either coin_to_recieve_amount or coin_to_sell_amount.",
      });
    }

    const amount =
      coin_to_sell_amount ||
      parseFloat((await pricingService.getPricingFromCoinbase(
        coin_to_sell,
        coin_to_recieve
      )).amount) * coin_to_recieve_amount;

    exchangeService
      .sell(coin_to_recieve, coin_to_sell, amount, wallet_id_with, wallet_id_to)
      .then((data) => res.json(data))
      .catch(next);
  }
}
