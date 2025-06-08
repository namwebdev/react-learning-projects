"use client"

import { supabaseBrowserClient as sbc } from "@/lib/supabase/supabase.client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await sbc.auth.getUser();
            setUser(user);
        }
            console.log("🚀 ~ fetchUser ~ user:", user)
        fetchUser();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
        </div>
    )
}