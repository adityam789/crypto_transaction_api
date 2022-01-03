import { NextFunction, Router, Request, Response } from "express";
import passport from "passport";
import WalletController from "../controllers/wallet.controller";
import scopeHandler from "../middleware/scopes.middleware";

const router = Router();

const walletController = new WalletController();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/create-wallet", scopeHandler("wallet.create"), walletController.createWallet);
router.get("/", scopeHandler("wallet.get"),walletController.getWallet);

/**
 * @api {post} /wallet/deposit Deposit
 * @apiName Deposit
 * @apiGroup Wallet
 * @apiDescription Deposit funds into a wallet
 * @apiParam {Number} amount The amount of funds to deposit
 * @apiParam {String} wallet_id The wallet to deposit to
 * @apiSuccess {Transaction} success Transaction object
 * @apiError {Object} error Error object
 */
 router.post("/deposit", scopeHandler("wallet.deposit"), walletController.depositFund);

/**
	* @api {post} /wallet/withdraw Withdraw
	* @apiName Withdraw
	* @apiGroup Wallet
	* @apiDescription Withdraw funds from a wallet
	* @apiParam {Number} amount The amount of funds to withdraw
	* @apiParam {String} wallet_id The wallet to withdraw from
	* @apiSuccess {Transaction} success Transaction object
	* @apiError {Object} error Error object
	*/
 router.post("/withdraw", scopeHandler("wallet.withdraw"), walletController.withdrawFund);

router.post("/transfer", scopeHandler("wallet.transfer"), walletController.transferFund);
export default router;
