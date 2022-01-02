import WalletService from "../services/wallet.service";
import { Request, Response, NextFunction } from "express";
import { Profile } from "../models/Profile.model";

export default class WalletController {
  walletService: WalletService = new WalletService();

  async depositFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, wallet_id } = req.body;
      const user = JSON.parse(req.user as string) as Profile;
      const wallet = await this.walletService.getById(wallet_id);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found",
        })
      }

      if (wallet.user_id !== user._id) {
        return res.status(401).json({
          success: false,
          message: "WARNING: This wallet is not yours",
        })
      }

      const result = await this.walletService.depositFund(wallet._id, amount);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async withdrawFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, wallet_id } = req.body;
      const user = JSON.parse(req.user as string) as Profile;
      const wallet = await this.walletService.getById(wallet_id);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found",
        })
      }

      if (wallet.user_id !== user._id) {
        return res.status(401).json({
          success: false,
          message: "WARNING: This wallet is not yours",
        })
      }

      const result = await this.walletService.withdrawFund(wallet._id, amount);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
