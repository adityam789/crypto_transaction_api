import { NextFunction, Request, Response } from "express";
import { Profile } from "../models/Profile.model";
import ProfileService from "../services/profile.service";

const profileService = new ProfileService();

export default class ProfileController {
  public async getProfile(req: Request, res: Response, next: NextFunction) {
    const user = req.user as Profile;

    if (!user) {
      next({ message: "User not found", code: 404 });
    }
    await profileService
      .getProfile(user._id)
      .then((profile) => {
        res.json(profile);
      })
      .catch((err) => {
        console.log(err);
        next({ message: "Error getting profile", code: 500 });
      });
  }
}
