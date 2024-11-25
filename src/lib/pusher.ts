/* eslint-disable no-var */
import PusherServer from "pusher";
import PusherClient from "pusher-js";

const CLUSTER = "ap1";

const pusherAppKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusherAppId = process.env.PUSHER_APP_ID!;
const pusherSecret = process.env.PUSHER_SECRET!;

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: pusherAppId,
    key: pusherAppKey,
    secret: pusherSecret,
    cluster: CLUSTER,
    useTLS: true,
  });
}

if (!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(pusherAppKey, {
    cluster: CLUSTER,
    channelAuthorization: {
      endpoint: "/api/pusher-auth",
      transport: "ajax",
    },
  });
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.pusherClientInstance;
