import { Request, Response, NextFunction } from "express";
import { UUID } from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

export interface AuthRequest extends Request {
  user?: UUID;
  token?: string;
}
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      res.status(401).json({ message: "No auth token, access denied!" });
      return;
    }

    const verified = jwt.verify(token, "My1SecretKey@");

    if (!verified) {
      res.status(401).json({ message: "Token verification failed" });
      return;
    }

    const veridiedToken = verified as { id: UUID };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, veridiedToken.id));
    if (!user) {
      res.status(401).json({ message: "User not found!" });
      return;
    }

    req.user = veridiedToken.id;
    req.token = token;

    next();
  } catch (e) {
    res.status(500).json({ message: e });
  }
};
