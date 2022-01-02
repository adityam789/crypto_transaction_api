import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as LocalStrategy } from "passport-local";

import AccountModel from "../models/Account.model";
import ProfileModel from "../models/Profile.model";

import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";

dotenv.config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const profile = await ProfileModel.findById(jwtPayload.id);
        if (profile) {
          return done(null, profile);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      accessToken = accessToken as string;
      refreshToken = refreshToken as string;
      const userAccount = await AccountModel.findOne({
        provider_name: "google",
        provider_account_id: profile.id,
      });
      if (userAccount) {
        userAccount.access_token = accessToken;
        userAccount.refresh_token = refreshToken;
        userAccount.save();
        return done(null, {
          id: userAccount.user_id,
          scopes: ["exchange", "profile", "funding", "wallet"],
        });
      }
      let userProfile = await ProfileModel.findOne({
        email: profile._json.email,
      });
      if (!userProfile) {
        const newProfile = new ProfileModel({
          name: profile._json.name,
          email: profile._json.email,
          email_verified: true,
          photo: profile._json.picture,
        });
        await newProfile.save();
        userProfile = newProfile;
      }
      const newUserAccount = new AccountModel({
        user_id: userProfile._id,
        provider_type: "OAuth",
        provider_name: "google",
        provider_account_id: profile.id,
        refresh_token: refreshToken,
        access_token: accessToken,
      });
      await newUserAccount.save();
      return done(null, {
        id: newUserAccount.user_id,
        scopes: ["exchange", "profile", "funding", "wallet"],
      });
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
      callbackURL: "/auth/discord/callback",
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      accessToken = accessToken as string;
      refreshToken = refreshToken as string;
      const userAccount = await AccountModel.findOne({
        provider_name: "discord",
        provider_account_id: profile.id,
      });
      if (userAccount) {
        userAccount.access_token = accessToken;
        userAccount.refresh_token = refreshToken;
        userAccount.save();
        return done(null, {
          id: userAccount.user_id,
          scopes: ["exchange", "profile", "funding", "wallet"],
        });
      }
      let userProfile = await ProfileModel.findOne({
        email: profile.email,
      });
      if (!userProfile) {
        const newProfile = new ProfileModel({
          name: profile.username,
          email: profile.email,
          email_verified: true,
          photo: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        });
        await newProfile.save();
        userProfile = newProfile;
      }
      const newUserAccount = new AccountModel({
        user_id: userProfile._id,
        provider_type: "OAuth",
        provider_name: "discord",
        provider_account_id: profile.id,
        refresh_token: refreshToken,
        access_token: accessToken,
      });
      await newUserAccount.save();
      return done(null, {
        id: newUserAccount.user_id,
        scopes: ["exchange", "profile", "funding", "wallet"],
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const userProfile = await ProfileModel.findOne({
        email,
      });

      if (!userProfile) {
        return done(null, false);
      }

      const userAccount = await AccountModel.findOne({
        user_id: userProfile._id,
        provider_name: "local",
      });

      if (!userAccount) {
        return done(null, false);
      }

      if (!userAccount.comparePassword(password)) {
        return done(null, false);
      }

      return done(null, {
        id: userAccount.user_id,
        scopes: ["exchange", "profile", "funding", "wallet"],
      });
    }
  )
);

export default passport;

export function passport_token_handler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const user = req.user as { id: string; scopes: string[] };
  const token = sign(
    {
      id: user.id,
      scopes: user.scopes,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  );
  res.json({ token });
}
