import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { randomUUID } from 'crypto';

export const createResume = async (req: Request, res: Response) => {
  try {
    const { userId, title, data, template, theme } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title ?? 'Untitled Resume',
        data: data ?? {},
        template: template ?? 'classic',
        theme: theme ?? {},
      },
    });
    res.json(resume);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const listResumes = async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const resumes = await prisma.resume.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }});
  res.json(resumes);
};

export const getResume = async (req: Request, res: Response) => {
  const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json(resume);
};

export const updateResume = async (req: Request, res: Response) => {
  const { title, data, template, theme } = req.body;
  try {
    const updated = await prisma.resume.update({
      where: { id: req.params.id },
      data: { title, data, template, theme },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(404).json({ error: 'Not found' });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    await prisma.resume.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
};

export const publishResume = async (req: Request, res: Response) => {
  const { id } = req.params;
  const slug = randomUUID().slice(0, 8);
  const updated = await prisma.resume.update({
    where: { id },
    data: { publicSlug: slug },
  });
  res.json({ publicUrl: `/r/${updated.publicSlug}`, resume: updated });
};

export const getPublicResume = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const resume = await prisma.resume.findUnique({ where: { publicSlug: slug } });
  if (!resume) return res.status(404).json({ error: 'Not found' });
  res.json(resume);
};
