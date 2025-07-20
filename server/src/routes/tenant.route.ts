import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { ROLES } from "@/constants.js";
import { getCurrentResidences } from "@/handlers/tenant.handler.js";

const prisma = new PrismaClient();

const tenantRoutes = new Hono();

tenantRoutes.use("*", authMiddleware([ROLES.TENANT]));

tenantRoutes.post("/", async (c) => {
  const { cognito_id, name, email, phone_number } = await c.req.json();
  if (!cognito_id || !name || !email)
    return c.json({ message: "Bad request" }, 400);

  try {
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId: cognito_id,
        name,
        email,
        phoneNumber: phone_number || "",
      },
    });
    if (tenant) return c.json(tenant, 201);
    return c.json({ message: "Error creating tenant" }, 500);
  } catch (error) {
    console.error("----- Error creating tenant", error);
    return c.json({ message: "Something went wrong" }, 500);
  }
});

tenantRoutes.get("/current-residences", getCurrentResidences);

tenantRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) return c.json({ message: "Bad request" }, 400);

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: id },
    });
    if (tenant) return c.json(tenant, 200);
    return c.json({ message: "Tenant not found" }, 404);
  } catch (error) {
    console.error("----- Error fetching tenant", error);
    return c.json({ message: "Something went wrong" }, 500);
  }
});



export default tenantRoutes;
