import path from "path";
import swaggerJsDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "Scalable REST API with JWT auth and role-based access"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: [path.join(__dirname, "../modules/**/*.routes.ts")]
});
