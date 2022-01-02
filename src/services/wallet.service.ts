import WalletModel from "../models/Wallet.model";
import TransactionService from "./transaction.service";

const transactionService = new TransactionService();

export default class WalletService {
  public async depositFundWithoutTransaction(walletId: string, amount: number) {
    const wallet = await WalletModel.findById(walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    wallet.balance += amount;
    wallet.updated_at = new Date();
    await wallet.save();
    return wallet;
  }
  public async depositFund(walletId: string, amount: number) {
    const wallet = await this.depositFundWithoutTransaction(walletId, amount);
    const transaction = await transactionService.create(
      "deposit",
      walletId,
      wallet.currency,
      wallet.currency,
      amount,
      amount
    );
    return transaction;
  }
  public async createWallet(
    user_id: string,
    currency: string,
    description?: string
  ) {
    const wallet = new WalletModel({
      user_id,
      currency,
      description,
    });

    await wallet.save();
    return wallet;
  }
  public async withdrawFundWithoutTransaction(
    wallet_id: string,
    amount: number
  ) {
    const wallet = await WalletModel.findById(wallet_id);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    if (wallet.balance < amount) {
      throw new Error("Insufficient funds");
    }
    wallet.balance -= amount;
    wallet.updated_at = new Date();
    await wallet.save();
    return wallet;
  }
  public async withdrawFund(wallet_id: string, amount: number) {
    const wallet = await this.withdrawFundWithoutTransaction(wallet_id, amount);
    const transaction = await transactionService.create(
      wallet_id,
      "withdraw",
      wallet.currency,
      wallet.currency,
      amount,
      amount
    );
    return transaction;
  }
  public async getAll(user_id: string) {
    const wallets = await WalletModel.find({ user_id });
    return wallets;
  }
  public async getbyCoin(user_id: string, currency: string) {
    const wallets = await WalletModel.find({ user_id, currency });
    return wallets;
  }
  public async getById(wallet_id: string) {
    const wallet = await WalletModel.findById(wallet_id);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  }
  public async exchangeBetweenWallet(
    wallet_id_from: string,
    wallet_id_to: string,
    amount: number
  ) {
    const wallet_from = await WalletModel.findById(wallet_id_from);
    const wallet_to = await WalletModel.findById(wallet_id_to);
    if (!wallet_from || !wallet_to) {
      throw new Error("Wallet not found");
    }
    if (wallet_from.balance < amount) {
      throw new Error("Insufficient funds");
    }
    wallet_from.balance -= amount;
    wallet_to.balance += amount;
    wallet_from.updated_at = new Date();
    wallet_to.updated_at = new Date();
    await wallet_from.save();
    await wallet_to.save();
    const transaction = await transactionService.create(
      wallet_id_from,
      wallet_id_to,
      wallet_from.currency,
      wallet_to.currency,
      amount,
      amount
    );
    return transaction;
  }
}
