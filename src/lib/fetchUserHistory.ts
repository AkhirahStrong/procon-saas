// src/utils/fetchHistory.ts
// import { supabase } from "@/lib/supabase";
import { createBrowserClient } from "@supabase/ssr";

//Fetch from browser (non-server)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchUserHistory(userEmail: string) {
  console.log("📬 Fetching history for email:", userEmail);

  const { data, error } = await supabase
    .from("chat_logs")
    .select("id, question, answer, created_at")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase fetch error:", error); // Log detailed error
    throw error;
  }

  console.log("✅ Supabase data:", data); // Log what we get back
  return data;
}
