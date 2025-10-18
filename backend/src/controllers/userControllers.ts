import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const ensureUser = async (req: Request, res: Response) => {
  const { email, name } = req.body as { email?: string; name?: string };
  if (!email) return res.status(400).json({ error: 'email required' });
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });
  res.json(user);
};
