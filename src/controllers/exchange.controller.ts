import { Request, Response, NextFunction } from "express";

import ExchangeService from "../services/exchange.service";
import PricingService from "../services/pricing.service";

const exchangeService = new ExchangeService();
const pricingService = new PricingService();

export default class ExchangeController {
  public async buyOrder(req: Request, res: Response, next: NextFunction) {
    const wallet_id_with = req.params.wallet_id_with;
    const wallet_id_to = req.params.wallet_id_to;
    const coin_to_sell = req.params.coin_to_sell;
    const coin_to_buy = req.params.coin_to_buy;
    const coin_to_buy_amount = parseFloat(req.params.coin_to_buy_amount);
    const coin_to_sell_amount = parseFloat(req.params.coin_to_sell_amount);

    if (coin_to_buy_amount && coin_to_sell_amount) {
      return res.json({
        success: false,
        message:
          "Too many parameters. Only mention either coin_to_buy_amount or coin_to_sell_amount.",
      });
    }

    const amount =
      coin_to_buy_amount ||
      (await pricingService.getPricingFromCoinbase(coin_to_buy, coin_to_sell)) *
        coin_to_sell_amount;

    exchangeService
      .buy(coin_to_sell, coin_to_buy, amount, wallet_id_with, wallet_id_to)
      .then((data) => res.json(data))
      .catch(next);
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
      (await pricingService.getPricingFromCoinbase(
        coin_to_sell,
        coin_to_recieve
      )) * coin_to_recieve_amount;

    exchangeService
      .sell(coin_to_recieve, coin_to_sell, amount, wallet_id_with, wallet_id_to)
      .then((data) => res.json(data))
      .catch(next);
  }
}
