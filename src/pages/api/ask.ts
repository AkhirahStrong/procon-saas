// API route: handles POST requests to /api/ask
// It sends a contract/question to OpenAI and stores the answer in Supabase

import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase"; // ✅ Make sure this points to your Supabase client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ⛔ Only allow POST requests
  if (req.method !== "POST") return res.status(405).end();

  // 📦 Destructure the expected values from the request body
  const { question, document, userEmail } = req.body;

  // 🚫 If any field is missing, return an error
  if (!question || !document || !userEmail) {
    return res.status(400).json({ error: "Missing fields." });
  }

  try {
    // 🔑 Create a new OpenAI client using your API key
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    // Trim long docs to avoid token limit
    const trimmedDocument = document.slice(0, 4000); // Approx. 1,000–1,500 tokens

    // 🧠 Send prompt to GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You're a contract assistant. Highlight potential red flags from legal or user safety perspectives.",
        },
        {
          role: "user",
          content: `Here is a privacy policy:\n\n${document}\n\nWhat are the red flags?`,
        },
      ],
    });

    // 📥 Extract the AI's reply
    const answer = response.choices[0].message.content;

    // 💾 Save the interaction into Supabase's "chat_logs" table
    const { data, error } = await supabase
      .from("chat_logs")
      .insert([
        {
          user_email: userEmail,
          question,
          answer,
          bookmarked: false, // optional: default value
        },
      ])
      .select("id"); // 👈 ensures we get back the new row’s ID

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ answer, id: data?.[0]?.id });

    // fir debugging
    if (process.env.NODE_ENV !== "production") {
      console.log("📤 Prompt sent to GPT:", document.slice(0, 300));
      console.log("✅ AI response:", answer);
    }

    content: `Analyze this contract. Return a bullet list of red flags or risks ONLY. Keep it concise:\n\n"""${trimmedDocument}"""`;

    // 🧨 Log and return error if Supabase insert fails
    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Insert failed" });
    }

    // ✅ All good! Return the AI's answer to the frontend
    res.status(200).json({ answer });
  } catch (err) {
    // 🧯 Catch any unexpected errors and log them
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI error" });
  }
}
