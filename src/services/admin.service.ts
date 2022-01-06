import AccountModel from "../models/Account.model";

export default class AdminService {
  public async get_id_discord(discordId: string) {
    try {
      const user = await AccountModel.findOne({
        provider_account_id: discordId,
        provider_name: "discord",
      });
      if (user) {
        return {
          user_id: user._id,
          scopes: user.scopes,
        };
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      throw err;
    }
  }
}
