import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { listUsersController } from "./admin.controller";

const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware(Role.ADMIN));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List all users (admin only)
 */
adminRouter.get("/users", listUsersController);

export default adminRouter;
