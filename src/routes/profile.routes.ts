import { NextFunction, Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import passport from "passport";
import ProfileController from "../controllers/profile.controller";

const profileController = new ProfileController();

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.use((req: Request, res: Response, next: NextFunction) => {
	const token = (req.headers.authorization as string).substring(7);
	const decoded = verify(token, process.env.JWT_SECRET as string) as {
		id: string;
		scopes: string[];
	};

	if(decoded.scopes.includes("profile")) {
		next();
	}	
	else {
		res.status(403).json({
			success: false,
			message: "Unauthorized. You do not have the required scopes.",
		});
	}
});

router.get("/", profileController.getProfile);

export default router;
