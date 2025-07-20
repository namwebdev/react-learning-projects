import { Hono } from "hono";
import v1Route from "./v1.route.js";

const routes = new Hono();

routes.route("/v1", v1Route);

export default routes;
