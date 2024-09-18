"use server";

import { LIMIT_MESSAGE } from "@/constants";
import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { Message, MessageWithSender, User } from "@/types/index";

export const getUserData = async (): Promise<User | null> => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("user.action - getUserData: No user found");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(
      "user.action - getUserData: Error fetching user data with id: ",
      user.id
    );
    console.error("getUserData error: ", error);
    return null;
  }

  return data;
};

export const getMessages = async (): Promise<MessageWithSender[] | null> => {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*, users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getMessages error: ", error);
    return null;
  }

  return data;
};
