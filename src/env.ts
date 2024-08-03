import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
});
const parsedResult = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedResult.success) {
  console.error(parsedResult.error);
  throw new Error("Invalid environment variables!");
}

export default parsedResult.data;
