// pages/api/upload-analyze.ts

import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ⛔ Disable default body parser so formidable can handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📄 Extract plain text from uploaded file
async function extractTextFromFile(file: formidable.File): Promise<string> {
  const ext = file.originalFilename?.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const buffer = fs.readFileSync(file.filepath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === "docx") {
    const buffer = fs.readFileSync(file.filepath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === "txt") {
    return fs.readFileSync(file.filepath, "utf-8");
  }

  throw new Error("Unsupported file type");
}

// 🚀 Main API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  //   const form = new formidable.IncomingForm({ keepExtensions: true });
  const form = formidable({ keepExtensions: true });

  console.log("📦 Starting form.parse...");

  form.parse(req, async (err, fields, files) => {
    try {
      if (err || !files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      console.log("📄 Uploaded file:", file.originalFilename);

      const text = await extractTextFromFile(file);
      console.log("📝 Extracted text sample:", text.slice(0, 100));

      if (!text || text.length < 100) {
        return res.status(400).json({ error: "File is too short or empty" });
      }

      const prompt = `
Analyze the following document and give:
- A concise summary
- A list of pros
- A list of cons
- Any red flags or risks
- A list of exact phrases found in the text that match or contain the red flags (for visual highlighting)


Respond ONLY in JSON format like this:
{
  "summary": "...",
  "pros": ["..."],
  "cons": ["..."],
  "red_flags": ["..."],
  highlights: ["exact phrase 1", "another phrase"]
}

Document:
"""${text.slice(0, 4000)}"""`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      let parsed;
      try {
        const content = completion.choices[0].message?.content || "{}";
        console.log("🧠 OpenAI raw output:", content);
        parsed = JSON.parse(content);
      } catch (err) {
        console.error("❌ Failed to parse OpenAI response:", err);
        return res
          .status(500)
          .json({ error: "Failed to parse OpenAI response." });
      }

      // Format answer for storing in chat history
      const formattedAnswer = `
**Summary**: ${parsed.summary}

**Pros**:
${parsed.pros.map((p: string) => `- ${p}`).join("\n")}

**Cons**:
${parsed.cons.map((c: string) => `- ${c}`).join("\n")}

**Red Flags**:
${parsed.red_flags.map((r: string) => `- ${r}`).join("\n")}
`;

      // Safely extract email from query param
      const emailParam = req.query.email;
      const userEmail =
        typeof emailParam === "string"
          ? emailParam
          : emailParam?.[0] || "unknown";

      // 💾 Insert into Supabase with error logging
      const { error: insertError } = await supabase.from("chat_logs").insert([
        {
          user_email: userEmail,
          question: "File Upload - Auto Analysis",
          answer: formattedAnswer,
          bookmarked: false,
        },
      ]);

      if (insertError) {
        console.error("❌ Supabase insert error:", insertError);
        return res.status(500).json({
          error: "Supabase insert failed",
          details: insertError.message,
        });
      }

      // 🎉 Return clean parsed result
      res.status(200).json({ ...parsed, rawText: text });
    } catch (error) {
      console.error(
        "❌ Upload Analyze Error:",
        error instanceof Error ? error.stack : error
      );
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
