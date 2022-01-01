import { Document, model, ObjectId, Schema } from "mongoose";

import crypto from "crypto";
interface Verification extends Document {
  user: ObjectId;
  verification_token: string;
  created_at: Date;
  updated_at: Date;
}

function randomToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

const VerificationSchema = new Schema<Verification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verification_token: {
    type: String,
    required: true,
    default: randomToken(),
  },
  created_at: {
    type: Date,
    default: new Date(Date.now()),
    expires: "1m",
  },
  updated_at: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const VerificationModel = model<Verification>(
  "Verification",
  VerificationSchema
);

export default VerificationModel;
