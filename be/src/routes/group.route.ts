import { PADDLE_PRODUCT_ID } from "@/env.js";
import type { AuthSession } from "@/lib/auth/auth-types.js";
import paddle from "@/lib/paddle/config.js";
import { Group, type IGroup } from "@db/models/group.model.js";
import { Hono } from "hono";
import { Types } from "mongoose";

const groupRoute = new Hono<AuthSession>();

groupRoute.get("/", async (c) => {
  const user = c.get("user");
  const groups = await Group.find({ owner: user!.id }).sort({ createdAt: -1 });

  return c.json(
    {
      success: true,
      result: groups,
    },
    200
  );
});

groupRoute.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  if (!Types.ObjectId.isValid(id))
    return c.json(
      {
        success: false,
        message: "Invalid request",
      },
      400
    );

  const group = await Group.findOne({ _id: id, owner: user!.id });
  if (!group)
    return c.json(
      {
        success: false,
        message: "Group not found",
      },
      404
    );

  return c.json(
    {
      success: true,
      result: group,
    },
    200
  );
});

groupRoute.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  if (!Types.ObjectId.isValid(body.id))
    return c.json(
      {
        success: false,
        message: "Invalid body",
      },
      400
    );

  const priceToUpdate = (Number(body.price) * 100).toString();
  const groupInfo = await Group.findOne({ _id: body.id });
  if (!groupInfo)
    return c.json(
      {
        success: false,
        message: "Group not found",
      },
      404
    );

  let isPriceAvail: any;
  let updatedGroup: IGroup | null;

  try {
    isPriceAvail = await paddle.prices.get(groupInfo.price_id);
  } catch (error) {
    console.info(
      "------- Price is not exist. Start create a new price! -------"
    );
  }

  if (isPriceAvail) {
    const price = await paddle.prices.update(groupInfo.price_id, {
      unitPrice: {
        amount: priceToUpdate,
        currencyCode: "USD",
      },
    });

    updatedGroup = await Group.findOneAndUpdate(
      { _id: body.id },
      {
        price: body.price,
        price_id: price.id,
      },
      { new: true }
    );
  } else {
    const price = await paddle.prices.create({
      name: `Price for ${groupInfo?.name}`,
      productId: PADDLE_PRODUCT_ID,
      billingCycle: {
        interval: "month",
        frequency: 1,
      },
      taxMode: "external",
      description: `Created by user ${user?.email}`,
      unitPrice: {
        amount: priceToUpdate,
        currencyCode: "USD",
      },
      quantity: {
        minimum: 1,
        maximum: 9999999,
      },
    });

    updatedGroup = await Group.findOneAndUpdate(
      { _id: body.id },
      {
        price: body.price,
        price_id: price.id,
      },
      { new: true }
    );
  }

  return c.json(
    {
      success: true,
      message: "Group has been updated successfully",
      result: updatedGroup,
    },
    200
  );
});

export default groupRoute;
