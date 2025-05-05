// src/utils/fetchHistory.ts
import { supabase } from "@/lib/supabase";

export async function fetchUserHistory(email: string) {
  const { data, error } = await supabase
    .from("chat_logs")
    .select("*")
    .eq("user_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching history:", error);
    throw error;
  }

  return data;
}
