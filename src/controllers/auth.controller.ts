import { Request, Response, NextFunction } from "express";
import { hashSync } from "bcrypt";
import VerificationModel from "../models/Verification.model";
import sgMail from "@sendgrid/mail";

import * as dotenv from "dotenv";
import ProfileModel from "../models/Profile.model";
import AccountModel from "../models/Account.model";
dotenv.config();

const BASE_URL = process.env.BASE_URL as string || "http://localhost:3000";
const EMAIL_PORT = (process.env.PORT === "80"|| process.env.PORT === "443") ? "" : `:${process.env.PORT}` || ":3000";
const SECURE_PROTOCOL = process.env.PORT === "443" ? "https" : "http";

const URL = process.env.NODE_ENV==="production"?`https://${BASE_URL}`:`${SECURE_PROTOCOL}://${process.env.HOST || "localhost"}${EMAIL_PORT}`;



sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    const profile = await ProfileModel.findOne({ email });

    if (profile) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const passwordErrors: string[] = [];

    if (password.length < 8) {
      passwordErrors.push("at least 8 characters");
    }

    if (!password.match(/[A-Z]/)) {
      passwordErrors.push("at least one uppercase letter");
    }

    if (!password.match(/[a-z]/)) {
      passwordErrors.push("at least one lowercase letter");
    }

    if (!password.match(/[0-9]/)) {
      passwordErrors.push("at least one number");
    }

    if (!password.match(/[^a-zA-Z0-9]/)) {
      passwordErrors.push("at least one special character");
    }

    if (passwordErrors.length > 0) {
      return res.json({
        success: false,
        message:
          "Password must contain the following: " + passwordErrors.join(", "),
      });
    }

    const newProfile = new ProfileModel({
      email,
      name,
      email_verified: false,
    });

    const newAccount = new AccountModel({
      user_id: newProfile._id,
      provider_type: "local",
      provider_name: "local",
      provider_account_id: newProfile._id,
      refresh_token: "",
      access_token: hashSync(password, 10),
      scopes: ["exchange", "profile", "funding", "wallet", "apikey"]
    });

    const verification = new VerificationModel({
      user: newProfile._id,
      type: "email_verification",
    });

    const msg: any = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Email verification",
      text: `Please verify your email by clicking on the following link: ${URL}/auth/verify/${verification.verification_token}`,
      html: `<p>Please verify your email by clicking on the following link:</p><p><a href="${URL}/auth/verify/${verification.verification_token}">${URL}/auth/verify/${verification.verification_token}</a></p>`,
    };
    try {
      await sgMail.send(msg);

      await newProfile.save();
      await newAccount.save();
      await verification.save();

      return res.json({
        success: true,
        message: "User created successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error occured while sending email",
      });
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;

    const verification = await VerificationModel.findOne({
      verification_token: token,
    });

    if (!verification) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await ProfileModel.findById(verification.user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    user.email_verified = true;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully.",
    });
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const profile = await ProfileModel.findOne({ email });

    if (!profile) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const verification = new VerificationModel({
      user: profile._id,
      type: "password_reset",
    });

    await verification.save();

    const msg: any = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Password reset",
      text: `Please reset your password by clicking on the following link: ${URL}/auth/reset/${verification.verification_token}`,
      html: `<p>Please reset your password by clicking on the following link:</p><p><a href="${URL}/auth/reset/${verification.verification_token}">${SECURE_PROTOCOL}://${BASE_URL}${EMAIL_PORT}/auth/reset/${verification.verification_token}</a></p>`,
    };

    await sgMail.send(msg);

    return res.json({
      success: true,
      message: "Email sent successfully.",
    });
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { password } = req.body;

    const verification = await VerificationModel.findOne({
      verification_token: token,
    });

    if (!verification) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const passwordErrors: string[] = [];

    if (password.length < 8) {
      passwordErrors.push("at least 8 characters");
    }

    if (!password.match(/[A-Z]/)) {
      passwordErrors.push("at least one uppercase letter");
    }

    if (!password.match(/[a-z]/)) {
      passwordErrors.push("at least one lowercase letter");
    }

    if (!password.match(/[0-9]/)) {
      passwordErrors.push("at least one number");
    }

    if (!password.match(/[^a-zA-Z0-9]/)) {
      passwordErrors.push("at least one special character");
    }

    if (passwordErrors.length > 0) {
      return res.json({
        success: false,
        message:
          "Password must contain the following: " + passwordErrors.join(", "),
      });
    }

    const user = await AccountModel.findOne({
      user_id: verification.user,
      provider_type: "local",
    });

    if (!user) {
      const newAccount = new AccountModel({
        user_id: verification.user,
        provider_type: "local",
        provider_name: "local",
        provider_account_id: verification.user,
        refresh_token: "",
        access_token: hashSync(password, 10),
        scopes: ["exchange", "profile", "funding", "wallet", "apikey"]
      });

      newAccount.save();

      return res.json({
        success: true,
        message: "Password reset successfully.",
      });
    }

    user.access_token = hashSync(password, 10);
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully.",
    });
  }
}
