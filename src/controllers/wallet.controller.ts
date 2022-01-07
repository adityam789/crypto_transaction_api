import WalletService from "../services/wallet.service";
import { Request, Response, NextFunction } from "express";
import { Profile } from "../models/Profile.model";

const walletService = new WalletService();

export default class WalletController {
  async getWallet(req: Request, res: Response, next: NextFunction) {
    const profile: Profile = req.user as Profile;
    const wallet_id = req.query.wallet_id as string;
    const currency = req.query.currency as string;

    if (wallet_id && currency) {
      return next({ code: 400, message: "Only one of wallet_id or currency" });
    }

    if (wallet_id) {
      const wallet = await walletService.getById(wallet_id);
      if (!wallet) {
        return next({ code: 404, message: "Wallet not found" });
      }
      if (wallet.user_id !== profile._id.toString()) {
        return next({
          code: 401,
          message: "WARNING: This wallet is not yours",
        });
      }
      return res.json({
        success: true,
        wallet,
      });
    }

    if (currency) {
      // tslint:disable-next-line: no-shadowed-variable
      const wallets = await walletService.getbyCoin(profile._id, currency);
      return res.json({
        success: true,
        wallets,
      });
    }

    const wallets = await walletService.getAll(profile._id);
    return res.json({
      success: true,
      wallets,
    });
  }

  async createWallet(req: Request, res: Response, next: NextFunction) {
    const { currency } = req.body;
    const user = req.user as Profile;

    if (!currency) {
      return next({ code: 400, message: "currency is required" });
    }

    const result = await walletService.createWallet(user._id, currency);

    res.status(200).json(result);
  }

  async depositFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = req.body;
      const amount = parseFloat(req.body.amount);
      if (!amount) {
        return next({ code: 400, message: "amount is required" });
      }
      if (!wallet_id) {
        return next({ code: 400, message: "Wallet_id is required" });
      }
      const user = req.user as Profile;
      const wallet = await walletService.getById(wallet_id);
      if (!wallet) {
        return next({ code: 404, message: "Wallet not found" });
      }

      if (wallet.user_id !== user._id.toString()) {
        return next({ code: 401, message: "WARNING: This wallet is not yours" });
      }

      const result = await walletService.depositFund(wallet._id, amount);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async withdrawFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = req.body;
      const amount = parseFloat(req.body.amount);
      const user = req.user as Profile;
      const wallet = await walletService.getById(wallet_id);
      if (!wallet) {
        return next({ code: 404, message: "Wallet not found" });
      }

      if (wallet.user_id !== user._id.toString()) {
        return next({ code: 401, message: "WARNING: This wallet is not yours" });
      }

      const result = await walletService.withdrawFund(wallet._id, amount);
      res.status(200).json(result);
    } catch (error: any) {
      next({ code: 400, message: error.message });
    }
  }

  async transferFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_from_id, wallet_to_id } = req.body;
      const amount = parseFloat(req.body.amount);
      const errors: string[] = [];
      if (!wallet_from_id) errors.push("Wallet_from_id is required");
      if (!wallet_to_id) errors.push("Wallet_to_id is required");
      if (!amount) errors.push("amount is required");

      if (errors.length > 0) {
        return next({ code: 400, message: errors.join(", ") });
      }

      const user = req.user as Profile;

      const wallet_from = await walletService.getById(wallet_from_id);
      const wallet_to = await walletService.getById(wallet_to_id);

      if (wallet_from.user_id !== user._id.toString()) {
        return next({
          code: 401,
          message: "WARNING: This wallet is not yours",
        });
      }
      const result = await walletService.exchangeBetweenWallet(
        wallet_from._id,
        wallet_to._id,
        amount
      );
      res.status(200).json(result);
    } catch (err: any) {
      next({ code: 400, message: err.message });
    }
  }
}
