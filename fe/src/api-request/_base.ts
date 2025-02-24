import { NEXT_PUBLIC_SERVER_BASE_URL } from "@/env";
import { HttpClient } from "@/lib/http";

const baseUrl = `${NEXT_PUBLIC_SERVER_BASE_URL}/api/v1`;

export const api = new HttpClient({
  baseUrl,
});
