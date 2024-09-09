"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import supabaseServerClientPages from "@/lib/supabase/supabaseServerPages";
import { User } from "@/types";

export const getUserData = async (): Promise<User | null> => {
  const supabase = await supabaseServerClient();
  const user = await getUseDataBySupabase(supabase);

  return user;
};

export const getUserDataPages = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> => {
  const supabase = supabaseServerClientPages(req, res);
  const user = await getUseDataBySupabase(supabase);

  return user;
};

const getUseDataBySupabase = async (
  supabase: SupabaseClient
): Promise<User | null> => {
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
