import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createApplication, getApplications, getApplicationById, updateApplication } from "@/handlers/application.handler.js";
import { Hono } from "hono";
import { ROLES } from "@/constants.js";

const applicationRoutes = new Hono();

applicationRoutes.get("/", authMiddleware([ROLES.MANAGER, ROLES.TENANT]), getApplications);
applicationRoutes.get("/:id", authMiddleware([ROLES.MANAGER, ROLES.TENANT]), getApplicationById);

applicationRoutes.post("/", authMiddleware([ROLES.TENANT]), createApplication);

applicationRoutes.put("/:id", authMiddleware([ROLES.MANAGER]), updateApplication);

export default applicationRoutes;