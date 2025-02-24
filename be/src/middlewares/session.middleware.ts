import type { Context, Next } from "hono";
import { auth } from "@/lib/auth/auth.js";

const addSession = async (c: Context, next: Next) => {
  const _session = await auth.api.getSession({ headers: c.req.raw.headers });

  const user = _session?.user || null;
  const session = _session?.session || null;

  c.set("user", user);
  c.set("session", session);

  return next();
};

export default addSession;
