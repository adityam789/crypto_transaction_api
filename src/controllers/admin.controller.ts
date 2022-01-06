import AdminService from "../services/admin.service";
import { NextFunction, Request, Response } from "express";

const adminService = new AdminService();

export default class AdminController {
  public async get_id_discord(req: Request, res: Response, next: NextFunction) {
    try {
      const discordId = req.query.discord_id as string;
      if (!discordId ||discordId === "") {
        throw new Error("Missing discordId");
      }
      const user = await adminService.get_id_discord(discordId);
      return res.json(user);
    } catch (err: any) {
      res.status(404).json({
        error: err.message,
      });
    }
  }
}
