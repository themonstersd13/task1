import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController
} from "./task.controller";
import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from "./task.schema";

const taskRouter = Router();

taskRouter.use(authMiddleware);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a task
 */
taskRouter.post("/", validate(createTaskSchema), createTaskController);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List tasks
 */
taskRouter.get("/", validate(listTasksSchema), listTasksController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get task by id
 */
taskRouter.get("/:id", validate(taskIdSchema), getTaskController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update task by id
 */
taskRouter.patch("/:id", validate(updateTaskSchema), updateTaskController);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete task by id
 */
taskRouter.delete("/:id", validate(taskIdSchema), deleteTaskController);

export default taskRouter;
