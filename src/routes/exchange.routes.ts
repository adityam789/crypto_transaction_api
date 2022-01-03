import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import ExchangeController from "../controllers/exchange.controller";
import { verify } from "jsonwebtoken"

const router = Router();

const exchangeController = new ExchangeController();

router.use(passport.authenticate("jwt", { session: false }));

router.use((req: Request, res: Response, next: NextFunction) => {
	const token = (req.headers.authorization as string).substring(7);
	const decoded = verify(token, process.env.JWT_SECRET as string) as {
		id: string;
		scopes: string[];
	};

	if(decoded.scopes.includes("exchange")) {
		next();
	}	
	else {
		res.status(403).json({
			success: false,
			message: "Unauthorized. You do not have the required scopes.",
		});
	}
});

/**
 * @api {post} /exchange/buy Buy
 * @apiName Buy
 * @apiGroup Exchange
 * @apiDescription Buy a coin against another coin
 * @apiParam {String} coin_to_buy The coin to buy
 * @apiParam {String} coin_to_sell The coin to sell
 * @apiParam {Number} coin_to_buy_amount The amount of coin_to_buy to buy
 * @apiParam {Number} coin_to_sell_amount The amount of coin_to_sell to sell
 * @condition coin_to_buy_amount || coin_to_sell_amount
 * @apiParam {String} wallet_id_with The wallet to buy from
 * @apiParam {String} wallet_id_to The wallet to deposit to
 * @apiSuccess {Transaction} success Transaction object
 * @apiError {Object} error Error object
 */
router.post("/buy", exchangeController.buyOrder);

/**
 * @api {post} /exchange/sell Sell
 * @apiName Sell
 * @apiGroup Exchange
 * @apiDescription Sell a coin against another coin
 * @apiParam {String} coin_to_recieve The coin to recieve
 * @apiParam {String} coin_to_sell The coin to sell
 * @apiParam {Number} coin_to_recieve_amount The amount of coin_to_recieve to recieve
 * @apiParam {Number} coin_to_sell_amount The amount of coin_to_sell to sell
 * @condition coin_to_recieve_amount || coin_to_sell_amount
 * @apiParam {String} wallet_id_with The wallet to sell from
 * @apiParam {String} wallet_id_to The wallet to deposit to
 * @apiSuccess {Transaction} success Transaction object
 * @apiError {Object} error Error object
 */
router.post("/sell", exchangeController.sellOrder);

export default router;
