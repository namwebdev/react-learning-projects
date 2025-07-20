import { cors } from "hono/cors";
import { CLIENT_DOMAIN } from "@/env.js";

const configCors = cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});

export default configCors;
