import { Document, model, Schema } from "mongoose";

interface Transaction extends Document {
  source_wallet_id: string;
  destination_wallet_id: string;
  coin_from: string;
  coin_to: string;
  source_amount: number;
  destination_amount: number;
  created_at: Date;
  updated_at: Date;
}

const TransactionSchema = new Schema<Transaction>({
  source_wallet_id: {
    type: String,
    required: true,
  },
  destination_wallet_id: {
    type: String,
    required: true,
  },
  coin_from: {
    type: String,
    required: true,
  },
  coin_to: {
    type: String,
    required: true,
  },
  source_amount: {
    type: Number,
    required: true,
  },
  destination_amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(Date.now()),
  },
  updated_at: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const TransactionModel = model<Transaction>("Transaction", TransactionSchema);

export default TransactionModel;
