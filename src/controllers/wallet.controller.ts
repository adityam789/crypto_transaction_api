import WalletService from "../services/wallet.service";
import { Request, Response, NextFunction } from "express";

export default class WalletController{
	walletService: WalletService = new WalletService();

	public async getAll(req: Request, res: Response, next: NextFunction){
		// const wallets = await this.walletService.getAll(req.user._id)
		// res.json(wallets);
	}
}