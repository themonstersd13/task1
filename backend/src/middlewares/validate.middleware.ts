import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
