import { Hono } from "hono";
import sessionRoute from "./session.route.js";
import statsRoute from "./stats.route.js";
import groupRoute from "./group.route.js";
import paddleWebhookRoute from "./paddle.route.js";
import orderRoute from "./order.route.js";
import paypalRoute from "./paypal-payout.route.js";

const routes = new Hono();

routes.route("/user", sessionRoute);

routes.route("/dashboard/stats", statsRoute);
routes.route("/dashboard/groups", groupRoute);

routes.route("/order", orderRoute);

routes.route("/webhook/paddle", paddleWebhookRoute);

routes.route("/paypal", paypalRoute);

export default routes;
