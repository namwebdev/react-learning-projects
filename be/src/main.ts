import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import configCors from "./middlewares/cors.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import db from "./lib/database/db.js";
import { auth } from "./lib/auth/auth.js";
import sessionHandler from "./middlewares/session.middleware.js";
import sessionValidator from "./middlewares/unauthorized-access.middleware.js";
import routes from "./routes/index.route.js";
import { initBot } from "./bot/index.js";

const app = new Hono();
const port = Number(process.env.APP_PORT) || 8080;

app.use(logger());
app.use(configCors);
app.use(sessionHandler);
app.use(sessionValidator);

app.onError(errorHandler);

db();

// Auth Route
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/", (c) => c.text("Welcome to the Telegram Bot API!"));

app.route("/api", routes);

initBot();

const server = serve({
  fetch: app.fetch,
  port,
});

server.on("listening", () => {
  console.info(`Server listening on port ${port}`);
});
