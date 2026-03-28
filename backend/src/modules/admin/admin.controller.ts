import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const listUsersController = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.status(200).json({ items: users });
};
