import { uploadImageForProperty, getProperties, createProperty, getPropertyById, getPropertyLeaseStatus, getPropertyLeases,  } from "@/handlers/property.handler.js";
import { Hono } from "hono";
import { ROLES } from "@/constants.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

const propertyRoutes = new Hono();

/** Public Routes */
propertyRoutes.get("/", getProperties);
propertyRoutes.get("/:id", getPropertyById);

/** --- Tenant Routes --- */
propertyRoutes.get("/:id/lease-status", authMiddleware([ROLES.TENANT]), getPropertyLeaseStatus);

/** --- Manager Routes --- */
propertyRoutes.get("/:id/leases", authMiddleware([ROLES.MANAGER]), getPropertyLeases);
propertyRoutes.post("/upload", authMiddleware([ROLES.MANAGER]), uploadImageForProperty);
propertyRoutes.post("/", authMiddleware([ROLES.MANAGER]), createProperty);

export default propertyRoutes;
