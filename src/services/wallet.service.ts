import cql from "./cassandra.service";
import { v4 as uuidv4 } from 'uuid';

export default class WalletService{
    public async depositFund(wallet_id: string, amount: number){
        const getQuery = "SELECT balance FROM wallets WHERE id = ?";
        const old_balance = await cql.execute(getQuery, [wallet_id]);
        const query = "update wallets set balance = ?, updated_at = ? where id = ?";
        cql.execute(query, [old_balance.rows[0].balance + amount, new Date(), wallet_id]);
    }
    public async createWallet(user_id: string ,product_id: string, description?: string){
        const id = uuidv4();
        const query = "INSERT INTO wallets (id, user_id, currency, balance, created_at, updated_at, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
        cql.execute(query, [id, user_id, product_id, 0.0, new Date(), new Date(), description])
    }
    public async withdrawFund(wallet_id: string, amount: number){
        const getQuery = "SELECT balance FROM wallets WHERE id = ?";
        const old_balance = await cql.execute(getQuery, [wallet_id]);
        if(old_balance.rows[0].balance < amount){
            throw new Error("Insufficient funds");
        }
        else{
            const query = "update wallets set balance = ?, updated_at = ? where id = ?";
            cql.execute(query, [old_balance.rows[0].balance - amount, new Date(), wallet_id]);
        }
    }
    public async getAll(user_id: string){
        const query = "SELECT * FROM wallets where user_id = ?";
        let wallets = await cql.execute(query, [user_id]);
        return wallets.rows;
    }
    public async getbyCoin(user_id: string, product_id: string){
        const query = "SELECT * FROM wallets where user_id = ?, product_id = ?";
        let wallets = await cql.execute(query, [user_id, product_id]);
        return wallets.rows;
    }
}