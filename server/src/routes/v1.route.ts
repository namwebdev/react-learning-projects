import { Hono } from "hono";
import tenantRoutes from "./tenant.route.js";
import propertyRoutes from "./property.route.js";
import managerRoutes from "./manager.route.js";
import applicationRoutes from "./application.route.js";

const routes = new Hono();

routes.route("/properties", propertyRoutes);
routes.route("/tenants", tenantRoutes);
routes.route("/managers", managerRoutes);
routes.route("/applications", applicationRoutes);

export default routes;
