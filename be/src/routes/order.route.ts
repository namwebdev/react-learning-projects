import { Hono } from "hono";
import { Transaction } from "@db/models/transaction.model.js";
import { Customer } from "@db/models/customer.model.js";

const orderRoute = new Hono();

orderRoute.get("/:key", async (c) => {
  const key = c.req.param("key");
  if (!key) return c.json({ success: false, message: "Invalid request" }, 400);

  const transaction = await Transaction.findOne({ anonymous_key: key });

  const customer = await Customer.findOne({ anonymous_key: key });

  const result = { customer, transaction };

  return c.json({ success: true, result }, 200);
});

export default orderRoute;
