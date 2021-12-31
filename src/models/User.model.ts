import { Document, model, Schema } from "mongoose";

interface User extends Document {
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
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

const UserModel = model<User>("User", UserSchema);

export default UserModel;