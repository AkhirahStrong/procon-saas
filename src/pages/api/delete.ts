import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  const { error } = await supabase.from("chat_logs").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
