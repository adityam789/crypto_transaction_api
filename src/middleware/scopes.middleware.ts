import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default function scopeHandler(scopeAllowed: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return next({ status: 401, message: "Unauthorized" });
    }

    if (!token.startsWith("Bearer ")) {
      return next({ status: 401, message: "Invalid token" });
    }

    const tokenArr = token.split(" ");
    const tokenString = tokenArr[1];

    try {
      const decoded = verify(tokenString, process.env.JWT_SECRET as string);

      const { scopes } = decoded as any;

      // exchange.buy - user scope - scopes [exchange, sell]
      // exchange.sell - scopesallowed [exchange, buy, x]
      // [1,1,0]

      for (const scope of scopes) {
        if (scopeAllowed.startsWith(scope)) {
          next();
          return;
        }
      }
      throw new Error("Invalid scope");
    } catch (error: any) {
      return next({ status: 401, message: error.message });
    }
  };
}
