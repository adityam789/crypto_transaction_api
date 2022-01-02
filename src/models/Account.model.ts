import { compareSync } from "bcrypt";
import { Document, model, Schema } from "mongoose";

export interface Account extends Document {
  user_id: string;
  provider_type: string;
  provider_name: string;
  provider_account_id: string;
  refresh_token: string;
  access_token: string;
  access_token_expires_at: Date;
  comparePassword(password: string): boolean;
}

const AccountSchema = new Schema<Account>({
  user_id: {
    type: String,
    required: true,
  },
  provider_type: {
    type: String,
    required: true,
  },
  provider_name: {
    type: String,
    required: true,
  },
  provider_account_id: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: false,
  },
  access_token: {
    type: String,
    required: false,
  },
  access_token_expires_at: {
    type: Date,
    required: false,
  },
});

AccountSchema.methods.comparePassword = function (password: string) {
  const account = this as Account;
  const isMatch = compareSync(password, account.access_token);
  return isMatch;
};

const AccountModel = model<Account>("Account", AccountSchema);

export default AccountModel;
