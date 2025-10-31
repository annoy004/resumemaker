import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma";

const JWT_SECRET: Secret = (process.env.JWT_SECRET ?? "default_secret") as Secret;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { email, name, picture, sub } = req.body;
    if (!email || !sub) {
      return res.status(400).json({ error: "Google user data missing" });
    }

    let user = await prisma.user.findUnique({ where: { sub } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, picture, sub },
      });
    } else {
      user = await prisma.user.update({
        where: { sub },
        data: { name, picture, email },
      });
    }

    // ✅ Create JWT safely (typed Secret)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ✅ Send cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch (err: any) {
    console.error("Google auth error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
};
