import { NextFunction, Request, Response, Router } from "express";

import transactionRoutes from "./exchange.routes";
import authRoutes from "./auth.routes";
import fundingRoutes from "./funding.routes";
import pricingRoutes from "./pricing.routes";
import router from "./exchange.routes";

const routes = Router();

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
routes.use("/auth", authRoutes);

routes.use("/transactions", transactionRoutes);
routes.use("/funding", fundingRoutes);
routes.use("/pricing", pricingRoutes);

routes.all("*",(req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Route not found",
  });
})

export default routes;
