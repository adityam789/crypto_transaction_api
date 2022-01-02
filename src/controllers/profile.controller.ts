import { NextFunction, Request, Response } from "express";
import { Profile } from "../models/Profile.model";
import ProfileService from "../services/profile.service";

const profileService = new ProfileService();

export default class ProfileController {
  public async getProfile(req: Request, res: Response, next: NextFunction) {
    const user = req.user as Profile;
    const userId: string | undefined = user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    await profileService
      .getProfile(userId)
      .then((profile) => {
        res.json(profile);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Internal server error",
        });
      });
  }
}
