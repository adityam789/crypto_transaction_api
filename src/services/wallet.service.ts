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
}
