import WalletService from "./wallet.service";
import PricingService from "./pricing.service";
// import WalletModel from "../models/Wallet.model";

export default class TransactionService {
  walletService: WalletService = new WalletService();
  pricingService: PricingService = new PricingService();

  public async buy(
    wallet_id_with: string,
    coin_to_buy: string,
    amount: number,
    wallet_id_to?: string
  ) {
    const price = await this.pricingService.getPricingFromCoinbase(coin_to_buy);
    this.walletService.withdrawFund(wallet_id_with, amount * price);
    if (!wallet_id_to) {
      wallet_id_to = await this.walletService.createWallet(
        wallet_id_with,
        coin_to_buy
      );
    }
    // @ts-ignore
    this.walletService.depositFund(wallet_id_to, amount);
    //this.walletService.createWallet(user_id, coin_to_buy, amount);
  }

  public async sell(
    wallet_id_with: string,
    wallet_id_to: string,
    coin_to_sell: string,
    amount: number
  ) {
    const price = await this.pricingService.getPricingFromCoinbase(
      coin_to_sell
    );
    this.walletService.withdrawFund(wallet_id_with, amount);
    this.walletService.depositFund(wallet_id_to, amount * price);
    //this.walletService.createWallet(user_id, coin_to_sell, amount * price);
  }
}
