"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase.server";

export const getUserData = async () => {
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
    return null;
  }

  return data;
};
