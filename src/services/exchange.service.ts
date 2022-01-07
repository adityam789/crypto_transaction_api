import WalletService from "./wallet.service";
import PricingService from "./pricing.service";
import TransactionService from "./transaction.service";
import WalletModel from "../models/Wallet.model";

export default class ExchangeService {
  walletService: WalletService = new WalletService();
  pricingService: PricingService = new PricingService();
  transactionService: TransactionService = new TransactionService();

  public async buy(
    coin_to_sell: string,
    coin_to_buy: string,
    amount: number,
    wallet_id_with: string,
    wallet_id_to?: string
  ) {
    try{
      if (!wallet_id_to) {
        const walletTo = await this.walletService.createWallet(
          wallet_id_with,
          coin_to_buy
        );
        wallet_id_to = walletTo._id.toString() as string;
      }
      const wallet_to = await WalletModel.findById(wallet_id_to);
      const wallet_from = await WalletModel.findById(wallet_id_with);
      if (!wallet_to || !wallet_from) {
        throw new Error("Wallet not found");
      }
      if (
        wallet_to.currency !== coin_to_buy ||
        wallet_from.currency !== coin_to_sell
      ) {
        throw new Error("Invalid currency");
      }
      const price = parseFloat(
        (
          await this.pricingService.getPricingFromCoinbase(
            coin_to_buy,
            coin_to_sell
          )
        ).amount
      );
      this.walletService.withdrawFundWithoutTransaction(
        wallet_id_with,
        amount * price
      );
      this.walletService.depositFundWithoutTransaction(wallet_id_to, amount);
      const transaction = await this.transactionService.create(
        wallet_from.id,
        wallet_to.id,
        coin_to_sell,
        coin_to_buy,
        amount,
        amount * price
      );
      return transaction;
    } catch(err:any){
      throw err;
    }
  }

  public async sell(
    coin_to_recieve: string,
    coin_to_sell: string,
    amount: number,
    wallet_id_with: string,
    wallet_id_to?: string
  ) {
    if (!wallet_id_to) {
      const walletTo = await this.walletService.createWallet(
        wallet_id_with,
        coin_to_recieve
      );
      wallet_id_to = walletTo._id as string;
    }
    const wallet_to = await WalletModel.findById(wallet_id_to);
    const wallet_from = await WalletModel.findById(wallet_id_with);
    if (!wallet_to || !wallet_from) {
      throw new Error("Wallet not found");
    }
    if (
      wallet_to.currency !== coin_to_recieve ||
      wallet_from.currency !== coin_to_sell
    ) {
      throw new Error("Invalid currency");
    }
    const price = await this.pricingService.getPricingFromCoinbase(
      coin_to_sell,
      coin_to_recieve
    );
    this.walletService.withdrawFundWithoutTransaction(wallet_id_with, amount);

    this.walletService.depositFundWithoutTransaction(
      wallet_id_to,
      amount * price
    );
    const transaction = await this.transactionService.create(
      wallet_from.id,
      wallet_to.id,
      coin_to_sell,
      coin_to_recieve,
      amount,
      amount * price
    );
    return transaction;
  }
}
