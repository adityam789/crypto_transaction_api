import { Request, Response, NextFunction } from "express";

export default class ExchangeController{
    public buy(req: Request, res: Response, next: NextFunction){
        const amount = req.body.amount;
        const {buy, sell} = req.body.coinpair.split('-');
        
    }
}