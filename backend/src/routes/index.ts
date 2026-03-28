import { Router } from "express";
import adminRouter from "../modules/admin/admin.routes";
import authRouter from "../modules/auth/auth.routes";
import taskRouter from "../modules/tasks/task.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);
router.use("/admin", adminRouter);

export default router;
