import env from "@/env";
import { HttpClient } from "@/lib/http";

const baseUrl = `${env.NEXT_PUBLIC_API_URL}/api/v1`;

export const api = new HttpClient({
  baseUrl,
});
