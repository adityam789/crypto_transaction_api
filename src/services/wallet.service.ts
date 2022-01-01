import WalletModel from "../models/Wallet.model";

export default class WalletService {
  public async depositFund(wallet_id: string, amount: number) {
    const wallet = await WalletModel.findById(wallet_id);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    wallet.balance += amount;
    wallet.updated_at = new Date();
    await wallet.save();
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
    return wallet._id;
  }
  public async withdrawFund(wallet_id: string, amount: number) {
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
  }
  public async getAll(user_id: string) {
    const wallets = await WalletModel.find({ user_id });
    return wallets;
  }
  public async getbyCoin(user_id: string, currency: string) {
    const wallets = await WalletModel.find({ user_id, currency });
    return wallets;
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
  }
}
