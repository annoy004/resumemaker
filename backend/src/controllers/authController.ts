import { Request, Response } from "express";
import { prisma } from "../prisma";

export const ensureGoogleUser = async (req: Request, res: Response) => {
  try {
    const { sub, email, name, picture } = req.body;

    if (!sub || !email)
      return res.status(400).json({ error: "Google user data missing" });

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { googleSub: sub } });

    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleSub: sub,
        picture,
      },
    });

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: error.message });
  }
};
