import { Request, Response, NextFunction } from "express";
import { compareSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import UserModel from "../models/User.model";
import VerificationModel from "../models/Verification.model";
import sgMail from "@sendgrid/mail";

import * as dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.comparePassword(password)) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.email_verified) {
      return res.status(401).json({
        message: "Email not verified",
      });
    }

    const userToken = sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
      algorithm: "HS256",
      subject: "user",
      issuer: "crypto-api",
    });

    return res.json({
      success: true,
      message: "Authentication successful.",
      token: userToken,
    });
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    let passwordErrors: string[] = [];

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

    const userModel = new UserModel({
      email,
      password_hash: hashSync(password, 10),
    });

    await userModel.save();

    const verification = new VerificationModel({
      user: userModel._id,
    });

    await verification.save();

    const msg: any = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Email verification",
      text: `Please verify your email by clicking on the following link: http://localhost:3000/auth/verify/${verification.verification_token}`,
      html: `<p>Please verify your email by clicking on the following link:</p><p><a href="http://localhost:3000/auth/verify/${verification.verification_token}">http://localhost:3000/api/auth/verify/${verification.verification_token}</a></p>`,
    };

    await sgMail.send(msg);

    return res.json({
      success: true,
      message: "User created successfully.",
    });
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

    const user = await UserModel.findOne({ _id: verification.user });

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
}
