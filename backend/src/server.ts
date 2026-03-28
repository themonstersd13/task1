import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
