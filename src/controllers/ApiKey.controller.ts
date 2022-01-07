import { NextFunction, Request, Response } from "express";
import ApiKeyModel from "../models/ApiKey.model";
import crypto from "crypto";
import { Profile } from "../models/Profile.model";

const allowedScopes = ["exchange", "profile", "funding", "wallet"];

export default class ApiKeyController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const scopes = req.body.scopes
      .split(",")
      .map((scope: string) => scope.trim());
    const user = req.user as Profile;

    if (!scopes.every((scope: string) => allowedScopes.includes(scope))) {
      return next({
        message: "Invalid scopes, Allowed scopes: " + allowedScopes.join(", "),
        code: 400,
      });
    }

    const errors: string[] = [];

    if (!scopes) errors.push("scopes is required");

    if (errors.length > 0) {
      return next({ message: errors.join(", "), code: 400 });
    }

    if (Object.values(scopes).includes("apikey")) {
      return next({ message: "apikey is not allowed", code: 400 });
    }
    const apiKey = new ApiKeyModel({ user_id: user._id.toString(), scopes });
    await apiKey.save();

    res.json({
      success: true,
      message: "ApiKey created",
      key: apiKey.key,
      scopes: apiKey.scopes,
    });
  }

  public async rollKey(req: Request, res: Response, next: NextFunction) {
    const { key_id } = req.params;
    const user = req.user as Profile;

    const errors: string[] = [];

    if (!key_id) errors.push("key_id is required");

    if (errors.length > 0) {
      return next({ message: errors.join(", "), code: 400 });
    }

    const apiKey = await ApiKeyModel.findById(key_id);

    if (!apiKey) {
      return next({ message: "ApiKey not found", code: 401 });
    }

    if (apiKey.user_id !== user._id.toString()) {
      return next({ message: "Unauthorized", code: 401 });
    }

    apiKey.rollKey();
    await apiKey.save();

    res.json({
      success: true,
      message: "ApiKey updated",
      key: apiKey.key,
      scopes: apiKey.scopes,
    });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { key_id } = req.params;
    const user = req.user as Profile;

    const errors: string[] = [];

    if (!key_id) errors.push("key is required");

    if (errors.length > 0) {
      return next({ message: errors.join(", "), code: 400 });
    }

    const apiKey = await ApiKeyModel.findById(key_id);

    if (!apiKey) {
      return next({ message: "ApiKey not found", code: 401 });
    }

    if (apiKey.user_id !== user._id.toString()) {
      return next({ message: "Unauthorized", code: 401 });
    }

    await apiKey.remove();

    res.json({
      success: true,
      message: "ApiKey deleted",
    });
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    const user = req.user as Profile;

    const errors: string[] = [];

    const apiKey = await ApiKeyModel.find(
      {
        user_id: user._id.toString(),
      },
      {
        key: 1,
        scopes: 1,
      }
    ).sort({ created_at: -1 });

    if (!apiKey) {
      return next({ message: "ApiKey not found", code: 401 });
    }

    res.json({
      success: true,
      message: "ApiKey found",
      key: apiKey,
    });
  }
}
