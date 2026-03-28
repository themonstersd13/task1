import { z } from "zod";

const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().max(1000).optional(),
    status: taskStatusSchema.optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().max(1000).optional(),
    status: taskStatusSchema.optional()
  })
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const listTasksSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: taskStatusSchema.optional()
  })
});
