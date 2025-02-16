import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./db";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../env";
import { createAuthMiddleware } from "better-auth/api";
import db from "../database/db";
import { Subscription } from "../database/schema/subscription.model";
import { ObjectId } from "mongodb";

const dbClient = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(dbClient),
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (c) => {
      const newSession = c.context.newSession;
      const user = newSession?.user;

      if (newSession && user) {
        try {
          await db();

          const isSubAvailable = await Subscription.findOne({ subscriber: user.id });
          if (isSubAvailable) return

          const subs = await Subscription.create({
            subscriber: user.id,
            status: "activated",
          });
          const userCollection = dbClient.collection("user");
          await userCollection.updateOne(
            {
              _id: new ObjectId(subs.subscriber),
            },
            {
              $set: { subscription: subs._id },
            }
          );
        } catch (error) {
          console.error(
            "Error in creating subscription in auth before hook: ",
            error
          );

          throw c.redirect("/sign-in");
        }
      }
    }),
  },
  plugins: [nextCookies()],
});
