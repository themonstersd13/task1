import { TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { createTask, deleteTaskById, getTaskById, listTasks, updateTaskById } from "./task.service";

const parseQueryNumber = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const createTaskController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const task = await createTask(user, req.body);
  res.status(201).json(task);
};

export const listTasksController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const data = await listTasks(user, {
    page: parseQueryNumber(req.query.page as string | undefined),
    limit: parseQueryNumber(req.query.limit as string | undefined),
    status: req.query.status as TaskStatus | undefined
  });

  res.status(200).json(data);
};

export const getTaskController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const task = await getTaskById(user, String(req.params.id));
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json(task);
};

export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const task = await updateTaskById(user, String(req.params.id), req.body);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json(task);
};

export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const deleted = await deleteTaskById(user, String(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).send();
};
