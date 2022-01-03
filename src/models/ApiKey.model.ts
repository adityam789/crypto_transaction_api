import { Document, model, Schema } from "mongoose";
import crypto from "crypto";

export interface ApiKey extends Document {
  user_id: string;
  scopes: string[];
  created_at: Date;
  updated_at: Date;
  signature: string;
  key: string;
	rollKey(): void;
}

const ApiKeySchema = new Schema<ApiKey>({
  user_id: {
    type: String,
    required: true,
  },
  scopes: {
    type: [String],
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(Date.now()),
		expires: "30d",
  },
  updated_at: {
    type: Date,
    required: true,
    default: new Date(Date.now()),
  },
  key: {
    type: String,
    required: true,
		unique: true,
		default: () => crypto.randomBytes(32).toString("hex"),
  },
});

ApiKeySchema.methods.rollKey = function () {
	const apiKey = this as ApiKey;
	apiKey.key = crypto.randomBytes(32).toString("hex");
	apiKey.updated_at = new Date(Date.now());
};

const ApiKeyModel = model<ApiKey>("ApiKey", ApiKeySchema);

export default ApiKeyModel;
