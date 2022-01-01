import { Router } from "express";
import WalletController from "../controllers/wallet.controller";

const router = Router();
const walletController = new WalletController();

router.get("/", walletController.getAll);
// router.get("/:wallet_id", walletController.getbyCoin);

// router.post("/deposit", walletController.depositFund);
// router.post("/withdraw", walletController.withdrawFund);

export default router;
