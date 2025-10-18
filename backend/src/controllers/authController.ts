import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

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

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // ✅ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (https)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    secure: false,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
};
