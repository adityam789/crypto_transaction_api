import { Request, Response, NextFunction } from "express";
import { compareSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import UserModel from "../models/User.model";

export default class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "Invalid email or password",
			});
		}

		if (!compareSync(password, user.password_hash)) {
			return res.status(401).json({
				message: "Invalid email or password",
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
				message: "Password must contain the following: " + passwordErrors.join(", "),
			});
		}

    const hashedPassword = hashSync(password, 10);

		const userModel = new UserModel({
			email,
			password_hash: hashedPassword,
		});
		

    return res.json({
      success: true,
      message: "User created successfully.",
    });
  }
}
