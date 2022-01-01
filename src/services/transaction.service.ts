import TransactionModel from "../models/Transaction.model";
import WalletModel from "../models/Wallet.model";

export default class TransactionService{
    public async create(source: string, destination: string, coin_from: string, coin_to: string, source_amount: number, destination_amount: number){
        const transaction = new TransactionModel({
            source_wallet_id: source,
            destination_wallet_id: destination,
            coin_from: coin_from,
            coin_to: coin_to,
            source_amount: source_amount,
            destination_amount: destination_amount,
        });
        await transaction.save();
        return transaction;
    }
    // public async getAll(){}
    public async getByUser(user_id: string, start_date?: Date, end_date?: Date, page: number = 1, limit: number = 10){
        if(!end_date){
            end_date = new Date();
        }
        if(!start_date){
            start_date = new Date(0);
        }
        const wallets = await WalletModel.find({user_id}, {_id: 1});
        const wallet_ids = wallets.map(wallet => wallet._id);
        const transactions = await TransactionModel.find({
            $or: [{source_wallet_id: {$in: wallet_ids}}, {destination_wallet_id: {$in: wallet_ids}}],
            created_at: {
                $gte: start_date,
                $lte: end_date,
            },
        }).skip((page - 1) * limit).limit(limit);
        return transactions;
    }
    public async getByWallet(wallet_id: string, start_date?: Date, end_date?: Date, page: number = 1, limit: number = 10){
        if(!end_date){
            end_date = new Date();
        }
        if(!start_date){
            start_date = new Date(0);
        }
        const transactions = await TransactionModel.find({
            $or: [{source_wallet_id: wallet_id}, {destination_wallet_id: wallet_id}],
            created_at: {
                $gte: start_date,
                $lte: end_date,
            },
        }).skip((page - 1) * limit).limit(limit);
        return transactions;
    }
    public async getById(transaction_id: string){
        const transaction = await TransactionModel.findById(transaction_id);
        if(!transaction){
            throw new Error("Transaction not found");
        }
        return transaction;
    }
}