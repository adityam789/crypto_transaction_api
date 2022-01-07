import { NextFunction, Request, Response, Router } from "express";

import authRoutes from "./auth.routes";
import exchangeRoutes from "./exchange.routes";
import pricingRoutes from "./pricing.routes";
import profileRoutes from "./profile.routes";
import walletRoutes from "./wallet.routes";
import ApiKeyRoutes from "./ApiKey.routes";
import adminRoutes from "./admin.routes";

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
routes.use("/exchange", exchangeRoutes);
routes.use("/pricing", pricingRoutes);
routes.use("/profile", profileRoutes);
routes.use("/wallet", walletRoutes);
routes.use("/apikey", ApiKeyRoutes);
routes.use("/admin", adminRoutes);

routes.use(
  (
    error: { message: string; code: number } = {
      message: "Route not found",
      code: 404,
    },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(error.code).json({
      message: error.message,
    });
  }
);

export default routes;
