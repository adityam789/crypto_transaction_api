import { NextFunction, Request, Response, Router } from "express";

import authRoutes from "./auth.routes";
import exchangeRoutes from "./exchange.routes";
import pricingRoutes from "./pricing.routes";
import profileRoutes from "./profile.routes";
import walletRoutes from "./wallet.routes";
import ApiKeyRoutes from "./ApiKey.routes";
import adminRoutes from "./admin.routes";
import rootRoutes from "./root.routes";

const routes = Router();

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

routes.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.is("application/json")) {
    return res.status(400).json({
      error: "Invalid content type, expected application/json",
    });
  }
  next();
});

routes.use("/auth", authRoutes);
routes.use("/exchange", exchangeRoutes);
routes.use("/pricing", pricingRoutes);
routes.use("/profile", profileRoutes);
routes.use("/wallet", walletRoutes);
routes.use("/apikey", ApiKeyRoutes);
routes.use("/admin", adminRoutes);
routes.use("/", rootRoutes);

routes.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default routes;
