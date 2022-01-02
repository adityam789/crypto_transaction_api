import ProfileModel from "../models/Profile.model";

export default class ProfileService {
  public async getProfile(user_id: string) {
    try {
      const profile = await ProfileModel.findById(user_id);
      return profile;
    } catch (err) {
      throw err;
    }
  }
}
