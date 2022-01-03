import { NextFunction, Request, Response } from "express";
import ApiKeyModel from "../models/ApiKey.model";
import crypto from "crypto";
import { Profile } from "../models/Profile.model";

const allowedScopes = ["exchange", "profile", "funding", "wallet"];

export default class ApiKeyController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const scopes = req.body.scopes.split(",").map((scope: string) => scope.trim());
    const user = req.user as Profile;
    
    if(!scopes.every((scope: string) => allowedScopes.includes(scope))) {
      return res.status(400).json({
        success: false,
        message: "Invalid scopes, Allowed scopes: " + allowedScopes.join(", "),
      });
    }


    const errors: string[] = [];

    if (!scopes) errors.push("scopes is required");

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    if(Object.values(scopes).includes("apikey")) {
      return res.status(400).json({
        success: false,
        message: "apikeys cannot generate apikeys",
      });
    }
    const apiKey = new ApiKeyModel({ user_id: user._id.toString(), scopes});
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
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    const apiKey = await ApiKeyModel.findById(key_id);

    if(!apiKey) {
      return res.status(404).json({
        success: false,
        message: "ApiKey not found",
      });
    }

    if(apiKey.user_id !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    const apiKey = await ApiKeyModel.findById(key_id);

    if(!apiKey) {
      return res.status(404).json({
        success: false,
        message: "ApiKey not found",
      });
    }

    if(apiKey.user_id !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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

    const apiKey = await ApiKeyModel.find({
      user_id: user._id.toString(),
    }, {
      key: 1,
      scopes: 1,
    }).sort({ created_at: -1 });

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "Invalid key",
      });
    }

    res.json({
      success: true,
      message: "ApiKey found",
      key: apiKey,
    });
  }
}

