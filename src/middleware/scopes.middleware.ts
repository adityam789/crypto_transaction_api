import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default function scopeHandler(scopeAllowed: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    const tokenArr = token.split(" ");
    const tokenString = tokenArr[1];

    try {
      const decoded = verify(tokenString, process.env.JWT_SECRET as string);

      const { scopes } = decoded as any;

      // exchange.buy - user scope - scopes [exchange, sell]
      // exchange.sell - scopesallowed [exchange, buy, x]
      // [1,1,0]

      scopes.map((scope: string) => {
        if (scopeAllowed.startsWith(scope)) {
          return next();
        }
      });
    } catch (error) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }
  };
}
