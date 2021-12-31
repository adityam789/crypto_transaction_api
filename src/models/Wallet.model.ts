import { Document, model, Schema } from "mongoose";

interface Wallet extends Document {
	user_id: string;
	currency: string;
	balance: number;
	created_at: Date;
	updated_at: Date;
	description: string;
}

const WalletSchema = new Schema<Wallet>({
	user_id: {
		type: String,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	balance: {
		type: Number,
		default: 0,
	},
	created_at: {
		type: Date,
		default: new Date(Date.now()),
	},
	updated_at: {
		type: Date,
		default: new Date(Date.now()),
	},
	description: {
		type: String,
		required: false,
		default: "",
	},
});

const WalletModel = model<Wallet>("Wallet", WalletSchema);

export default WalletModel;