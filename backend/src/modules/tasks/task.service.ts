import { Role, TaskStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

interface UserContext {
  userId: string;
  role: Role;
}

interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

interface TaskListQuery {
  page?: number;
  limit?: number;
  status?: TaskStatus;
}

const parsePagination = (query: TaskListQuery) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 10;
  return { page, limit, skip: (page - 1) * limit };
};

export const createTask = async (user: UserContext, input: TaskInput) => {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      ownerId: user.userId
    }
  });
};

export const listTasks = async (user: UserContext, query: TaskListQuery) => {
  const { page, limit, skip } = parsePagination(query);

  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(user.role === Role.ADMIN ? {} : { ownerId: user.userId })
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.task.count({ where })
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getTaskById = async (user: UserContext, taskId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    return null;
  }

  if (user.role !== Role.ADMIN && task.ownerId !== user.userId) {
    return null;
  }

  return task;
};

export const updateTaskById = async (user: UserContext, taskId: string, input: Partial<TaskInput>) => {
  const task = await getTaskById(user, taskId);
  if (!task) {
    return null;
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {})
    }
  });
};

export const deleteTaskById = async (user: UserContext, taskId: string) => {
  const task = await getTaskById(user, taskId);
  if (!task) {
    return false;
  }

  await prisma.task.delete({ where: { id: taskId } });
  return true;
};
