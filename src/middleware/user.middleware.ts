import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../models/User.model";

export default function userHandler(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {	
			return res.status(401).json({
				success: false,
				message: "No token provided"
			});
		}
		
		try {
			const decoded = verify(token, process.env.JWT_SECRET as string) as User;
			// req.user = decoded;
			next();
		} catch (err) {
			return res.status(401).json({
				success: false,
				message: "Invalid token"
			});
		}
}