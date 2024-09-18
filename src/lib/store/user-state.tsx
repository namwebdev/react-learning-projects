"use client";

import { useEffect, useRef } from "react";
import { User } from "@/types/index";
import { useUser } from "./user";

function UserStateStore({ user }: { user: User }) {
  const state = useRef(false);

  useEffect(() => {
    if (!state.current) useUser.setState({ user });
    state.current = true;
  }, []);

  return <></>;
}

export default UserStateStore;
