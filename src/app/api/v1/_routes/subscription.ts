import { getServerSession } from "@/actions/auth.action";
import db from "@/lib/database/db";
import { Subscription } from "@/lib/database/schema/subscription.model";
import { Hono } from "hono";

const subscriptionRoute = new Hono();

subscriptionRoute.post("/", async (c) => {
    try {
        // For JSON data
        const body = await c.req.json()
        const { user_id, extra_storage_in_byte } = body;
        if (!user_id || !extra_storage_in_byte) {
            return c.json({ message: "User ID and extra storage in byte are required" }, 400);
        }

        await db();
        await Subscription.updateOne(
            { subscriber: user_id },
            {
                status: "canceled",
                subscriptionType: "free",
                $inc: {
                    selectedStorage: extra_storage_in_byte,
                },
            }
        );

        return c.json({ message: "Subscription updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error in subscription route: ", error);
        return c.json({
            message: "Error parsing request body",
        }, 400);
    }
});

export default subscriptionRoute;

