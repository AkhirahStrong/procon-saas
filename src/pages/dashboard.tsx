// pages/dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import FileUpload from "@/components/FileUpload";
import { exportChatAsText } from "@/utils/exportChat";
import { fetchUserHistory } from "@/utils/fetchHistory";
import { HistoryItem } from "@/types/history";

export default function Dashboard() {
  const { user } = useUser();
  const [document, setDocument] = useState("");
  const [rawText, setRawText] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<HistoryItem[]>([]);
  const [summaryData, setSummaryData] = useState<{
    summary: string;
    pros: string[];
    cons: string[];
    red_flags: string[];
  } | null>(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserHistory(user.primaryEmailAddress.emailAddress)
        .then(setChat)
        .catch(console.error);
    }
  }, [user]);

  const askAI = async () => {
    const content = document || rawText;
    if (!question.trim() || !content.trim()) return;

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        document: content,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      }),
    });

    const data = await res.json();

    if (res.ok && data.answer && data.id) {
      setChat((prev) => [
        {
          id: data.id,
          question,
          answer: data.answer,
          created_at: new Date().toISOString(),
          bookmarked: false,
        },
        ...prev,
      ]);
      setQuestion("");
    }
  };

  return (
    <DashboardLayout chat={chat} setChat={setChat}>
      <FileUpload
        userEmail={user?.primaryEmailAddress?.emailAddress || ""}
        onComplete={async (result) => {
          setRawText(result.rawText);
          setDocument(result.rawText);
          setSummaryData({
            summary: result.summary,
            pros: result.pros,
            cons: result.cons,
            red_flags: result.red_flags,
          });

          const formatted = `**Summary**: ${
            result.summary
          }\n\n**Pros**:\n${result.pros.join(
            "\n- "
          )}\n\n**Cons**:\n${result.cons.join(
            "\n- "
          )}\n\n**Red Flags**:\n${result.red_flags.join("\n- ")}`;

          const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: "File Upload - Auto Analysis",
              document: result.rawText,
              userEmail: user?.primaryEmailAddress?.emailAddress,
            }),
          });

          const data = await res.json();
          if (res.ok && data.id) {
            setChat((prev) => [
              {
                id: data.id,
                question: "File Upload - Auto Analysis",
                answer: formatted,
                created_at: new Date().toISOString(),
                bookmarked: false,
              },
              ...prev,
            ]);
          }
        }}
      />

      <textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        placeholder="Paste your contract or policy..."
        className="w-full h-40 p-4 border rounded shadow"
      />

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={askAI}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => exportChatAsText(chat)}
          className="px-3 py-1 text-sm bg-gray-200 rounded"
        >
          Export All
        </button>
        <button
          onClick={() => exportChatAsText(chat, true)}
          className="px-3 py-1 text-sm bg-gray-200 rounded"
        >
          Export Bookmarked
        </button>
      </div>

      {summaryData && (
        <div className="bg-white border rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>{summaryData.summary}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-700">Pros</h2>
            <ul className="list-disc pl-5 text-green-800">
              {summaryData.pros.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-600">Cons</h2>
            <ul className="list-disc pl-5 text-yellow-700">
              {summaryData.cons.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600">Red Flags</h2>
            <ul className="list-disc pl-5 text-red-700">
              {summaryData.red_flags.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
