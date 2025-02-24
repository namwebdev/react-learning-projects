import { Hono } from "hono";
import axios from "axios";
import { randomBytes } from "crypto";
import { Integration } from "@/lib/database/models/intergration.model.js";
import { Wallet } from "@/lib/database/models/wallet.model.js";
import type { AuthSession } from "@/lib/auth/auth-types.js";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } from "@/env.js";
import { Payout } from "@/lib/database/models/payout.model.js";
import { Types } from "mongoose";

const paypalRoute = new Hono<AuthSession>();

paypalRoute.post("/", async (c) => {
  const user = c.get("user")!;
  const { amount } = await c.req.json();

  const wallet = await Wallet.findOne({ owner: user.id });
  if (!wallet) {
    throw "Server error. Please try again.";
  }

  const integration = await Integration.findOne({ owner: user.id });
  if (!integration) {
    return c.json(
      {
        success: true,
        message: "Integrate paypal payout account before payout",
        result: null,
      },
      200
    );
  }

  const recipient = randomBytes(10).toString("hex");
  const token = await generatePaypalAccessToken();
  const {
    paypal: { currency, email },
  } = integration;
  const { balance } = wallet;

  if (amount > balance) {
    return c.json(
      {
        success: true,
        message: `Insufficient balance. You have ${balance}`,
        result: null,
      },
      200
    );
  }

  const resPayoutCreate = await axios.post(
    `${paypalV1Url}/payments/payouts`,
    {
      sender_batch_header: {
        sender_batch_id: `batch-${recipient}`,
        email_subject: "You have a payout!",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: currency,
          },
          receiver: email,
          note: "Thank you for your service!",
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const payoutBatchId = resPayoutCreate.data.batch_header.payout_batch_id;

  const resPayoutDetails = await axios.get(
    `${paypalV1Url}/payments/payouts/${payoutBatchId}?total_required=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const payoutItemId = resPayoutDetails.data.items[0].payout_item_id;
  const payoutItemStatus = resPayoutDetails.data.items[0].transaction_status;

  const payout = await Payout.create({
    owner: user.id,
    amount,
    paypal: {
      payout_batch_id: payoutBatchId,
      payout_item_id: payoutItemId,
    },
    status: payoutItemStatus,
  });

  return c.json(
    { success: true, message: "Payout requested successful", result: payout },
    200
  );
});

paypalRoute.post("/connect", async (c) => {
  const { email, id } = c.get("user")!;

  let integration = await Integration.findOne({ owner: id });
  if (integration) {
    integration = await Integration.findOneAndUpdate(
      { owner: id },
      {
        paypal: {
          email: email,
        },
      },
      { new: true }
    );
  } else {
    integration = await Integration.create({
      owner: id,
      paypal: {
        email: email,
      },
    });
  }

  return c.json(
    { success: true, message: "Paypal connected!", result: integration },
    201
  );
});

paypalRoute.post("/payout/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  if (!Types.ObjectId.isValid(id)) {
    return c.json({ success: false, message: "Invalid request" }, 400);
  }

  const payout = await Payout.findOne({ _id: id, owner: user!.id });
  if (!payout) {
    return c.json({ success: false, message: "Payout not found" }, 404);
  }

  if (payout.status === "SUCCESS") {
    return c.json({ success: false, message: "Payout already processed" }, 400);
  }

  const token = await generatePaypalAccessToken();
  console.log("🚀 ~ paypalRoute.post ~ token:", token)

  const payoutItemDetail = await axios.get(
    `${paypalV1Url}/payments/payouts-item/${payout.paypal.payout_item_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const payoutItemStatus = payoutItemDetail.data.transaction_status;

  await Payout.updateOne({ _id: id }, { status: payoutItemStatus });

  if (payoutItemStatus === "SUCCESS") {
    await Wallet.updateOne(
      { owner: payout.owner },
      {
        $inc: {
          balance: -payout.amount,
          withdraw: payout.amount,
        },
      }
    );
  }

  return c.text("ok", 200);
});

const paypalV1Url = "https://api-m.sandbox.paypal.com/v1";
async function generatePaypalAccessToken(): Promise<string> {
  const res = await axios.post(
    `${paypalV1Url}/oauth2/token`,
    { grant_type: "client_credentials" },
    {
      auth: {
        username: PAYPAL_CLIENT_ID!,
        password: PAYPAL_SECRET_KEY!,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}
export default paypalRoute;
