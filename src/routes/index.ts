import { NextFunction, Request, Response, Router } from "express";

import transactionRoutes from "./transaction.routes";
import authRoutes from "./auth.routes";
import fundingRoutes from "./funding.routes";
import pricingRoutes from "./pricing.routes";

const routes = Router();

routes.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
})

routes.use("/transactions", transactionRoutes);
routes.use("/auth", authRoutes);
routes.use("/funding", fundingRoutes);
routes.use("/pricing", pricingRoutes);

export default routes;
