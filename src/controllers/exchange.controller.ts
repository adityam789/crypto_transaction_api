import { Request, Response, NextFunction } from "express";

import ExchangeService from "../services/exchange.service";

const exchangeService = new ExchangeService();

export default class ExchangeController {

    public buyOrder(req: Request, res: Response, next: NextFunction) {
        const wallet_id_with = req.params.wallet_id_with;
        const wallet_id_to = req.params.wallet_id_to;
        const coin_to_buy = req.params.coin_to_buy;
        const amount = req.params.amount as string;
        const amount_int = parseInt(amount);
        exchangeService
          .buy(wallet_id_with, coin_to_buy, amount_int, wallet_id_to)
          .then((data) => res.json(data))
          .catch(next);
    }

    public sellOrder(req: Request, res: Response, next: NextFunction) {
        const wallet_id_with = req.params.wallet_id_with;
        const wallet_id_to = req.params.wallet_id_to;
        const coin_to_sell = req.params.coin_to_sell;
        const amount = req.params.amount as string;
        const amount_int = parseInt(amount);
        exchangeService
          .sell(wallet_id_with, wallet_id_to, coin_to_sell, amount_int)
          .then((data) => res.json(data))
          .catch(next);
    }

}