import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { ROLES } from "@/constants.js";

const prisma = new PrismaClient();

const managerRoutes = new Hono();

managerRoutes.use("*", authMiddleware([ROLES.MANAGER]));

managerRoutes.get("/:id", async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Bad request" }, 400);

    try {
        const manager = await prisma.manager.findUnique({
            where: { cognitoId: id },
        });
        if (manager) return c.json(manager, 200);
        return c.json({ message: "Manager not found" }, 404);
    } catch (error) {
        console.error("----- Error fetching manager", error);
        return c.json({ message: "Something went wrong" }, 500);
    }
});

managerRoutes.post("/", async (c) => {
    const { cognito_id, name, email, phone_number } = await c.req.json();
    if (!cognito_id || !name || !email)
        return c.json({ message: "Bad request" }, 400);

    try {
        const manager = await prisma.manager.create({
            data: {
                cognitoId: cognito_id,
                name,
                email,
                phoneNumber: phone_number || "",
            },
        });
        if (manager) return c.json(manager, 201);
        return c.json({ message: "Error creating manager" }, 500);
    } catch (error) {
        console.error("----- Error creating manager", error);
        return c.json({ message: "Something went wrong" }, 500);
    }
});

export default managerRoutes;
