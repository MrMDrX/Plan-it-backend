import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { auth, AuthRequest } from "../middleware/auth";

const authRouter = Router();

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

/// User signup
authRouter.post(
  "/signup",
  async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        res
          .status(400)
          .json({ message: "User with this email already exists!" });
        return;
      }

      const hashedPassword = await bcryptjs.hash(password, 8);

      const newUser: NewUser = {
        name,
        email,
        password: hashedPassword,
      };

      const [user] = await db.insert(users).values(newUser).returning();
      res.status(201).json({ message: "User created successfully", user });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

/// User login
authRouter.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
      const { email, password } = req.body;
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!existingUser) {
        res
          .status(400)
          .json({ message: "User with this email does not exist!" });
        return;
      }

      const isMatch = await bcryptjs.compare(password, existingUser.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign({ id: existingUser.id }, "My1SecretKey@");

      res.status(200).json({ ...existingUser, token });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

/// Check if token is valid
authRouter.post("/isTokenValid", async (req: Request, res: Response) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      res.json(false);
      return;
    }

    const verified = jwt.verify(token, "My1SecretKey@");

    if (!verified) {
      res.json(false);
      return;
    }

    const veridiedToken = verified as { id: string };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, veridiedToken.id));
    if (!user) {
      res.json(false);
      return;
    }

    res.json(true);
  } catch (e) {
    res.status(500).json(false);
  }
});

/// Get current user
authRouter.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not found!" });
      return;
    }
    const [user] = await db.select().from(users).where(eq(users.id, req.user));
    res.json({ ...user, token: req.token });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default authRouter;
