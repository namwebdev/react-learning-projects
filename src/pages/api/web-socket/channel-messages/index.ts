import { getUserDataPages } from "@/actions/user.action";
import supabaseServerClientPages from "@/lib/supabase/supabaseServerPages";
import { User } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userData = await getUserDataPages(req, res);
  if (!userData) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") return handlePostMessage(req, res, userData);

  return res.status(405).json({
    message: "Method not allowed!",
  });
}

async function handleGetMessages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { channelId } = req.query;
    if (!channelId)
      return res.status(400).json({
        message: "Bad request",
        details: "channelId is required",
      });

    const supabase = supabaseServerClientPages(req, res);
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*, user: user_id(*)")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });

    if (error)
      return res.status(500).json({
        message: "Internal server error",
        details: "Failed to fetch messages",
      });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("MESSAGE FETCH ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePostMessage(req: NextApiRequest, res: NextApiResponse, userData: User) {
  try {
    const { channelId, workspaceId } = req.query;
    if (!channelId || !workspaceId)
      return res.status(400).json({
        message: "Bad request",
        details: "channelId and workspaceId are required",
      });

    const body = JSON.parse(req.body);
    const { content, fileUrl } = body;
    if (!content)
      return res.status(400).json({
        message: "Bad request",
        details: "content is required",
      });

    const supabase = supabaseServerClientPages(req, res);
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("id", channelId)
      .contains("members", [userData.id]);
    if (error || !data?.length)
      return res.status(403).json({ message: "Channel not found" });

    const { data: newMess, error: createMessageErr } = await supabase
      .from("messages")
      .insert({
        user_id: userData.id,
        workspace_id: workspaceId,
        channel_id: channelId,
        content,
        ...(fileUrl && { fileUrl }),
      })
      .select("*, user: user_id(*)")
      .order("created_at", { ascending: true })
      .single();

    if (createMessageErr)
      return res.status(500).json({
        message: "Internal server error",
        details: "Failed to create message",
      });
    return res
      .status(200)
      .json({ message: "Message created successfully", data: newMess });
  } catch (error) {
    console.error("MESSAEGE CREATION ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
