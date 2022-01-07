import { NextFunction, Request, Response } from "express";

export default class RootController {
	public index(req: Request, res: Response, next: NextFunction) {
		res.json({
			success: true,
			message: "Welcome to the crypto_transaction API",
		});
	}
}