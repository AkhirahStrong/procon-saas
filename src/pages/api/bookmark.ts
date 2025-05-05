// pages/api/bookmark.ts

import { supabase } from "@/lib/supabase"; // Supabase client for DB updates
import type { NextApiRequest, NextApiResponse } from "next";

// This API route handles POST requests to toggle the 'bookmarked' field on a chat entry
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 🛑 Reject all non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // ✅ Extract ID and bookmark value from the request body
  const { id, bookmarked } = req.body;

  // 🛑 Validate inputs
  if (!id || typeof bookmarked !== "boolean") {
    return res.status(400).json({ error: "Missing ID or bookmark status" });
  }

  // 🔄 Update the 'bookmarked' value for the specified row in Supabase
  const { error } = await supabase
    .from("chat_logs")
    .update({ bookmarked }) // Set new bookmark value (true/false)
    .eq("id", id); // Match by row ID

  // ❌ Handle Supabase error (e.g., row not found, connection issue)
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // ✅ Return success if update went through
  return res.status(200).json({ success: true });
}
