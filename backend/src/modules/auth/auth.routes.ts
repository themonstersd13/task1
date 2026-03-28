import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { loginController, registerController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 */
authRouter.post("/register", validate(registerSchema), registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 */
authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;
