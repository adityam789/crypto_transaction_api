import { Document, model, Schema } from "mongoose";
import { compareSync, hashSync } from "bcrypt";

export interface User extends Document {
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
  comparePassword(password: string): boolean;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
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
  email_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
});

UserSchema.methods.comparePassword = function (password: string){
  const user = this as User;
  const isMatch = compareSync(password, user.password_hash);
  return isMatch;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
