import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to register user";
    const status = message === "Email already registered" ? 409 : 400;
    res.status(status).json({ message });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to login";
    const status = message === "Invalid credentials" ? 401 : 400;
    res.status(status).json({ message });
  }
};
