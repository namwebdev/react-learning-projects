import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import configCors from "./middlewares/cors.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import routes from "./routes/index.route.js";

const app = new Hono();
const port = Number(process.env.APP_PORT) || 8080;

app.use(logger());
app.use(configCors);

app.onError(errorHandler);

app.get("/", (c) => c.text("Hello World!"));

app.route("/api", routes);

const server = serve({
  fetch: app.fetch,
  port,
});

server.on("listening", () => {
  console.info(`Server listening on port ${port}`);
});
