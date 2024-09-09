import { NextResponse } from "next/server";
import { getUserData } from "@/actions/user.action";
import { supabaseServerClient } from "@/lib/supabase/supabase.server";
function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
}

export async function GET(req: Request) {
  try {
    const userData = await getUserData();
    if (!userData) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = await supabaseServerClient();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!channelId || channelId === "undefined") {
      return new Response("Invalid or missing channelId", { status: 400 });
    }

    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));

    const { from, to } = getPagination(page, size);

    const { data, error } = await supabase
      .from("messages")
      .select("*, user: user_id (*)")
      .eq("channel_id", channelId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET MESSAGES ERROR: ", error);
      return new Response("Bad Request", { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.log("SERVER ERROR: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
