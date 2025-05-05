import DashboardLayout from "@/components/layouts/DashboardLayout";
import { HistoryItem } from "@/types/history";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const { user } = useUser(); // 🔐 Clerk user
  const [document, setDocument] = useState(""); // 📄 The contract or policy text
  const [question, setQuestion] = useState(""); // ❓ The user’s question
  const [chat, setChat] = useState<any[]>([]); // 💬 Chat history in this session
  const [loading, setLoading] = useState(false);

  // 🚀 Submit question to the API
  const askAI = async () => {
    if (!question.trim() || !document.trim()) return;
    setLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        document,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      }),
    });

    const data = await res.json();
    setChat((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "ai", content: data.answer },
    ]);

    setQuestion("");
    setLoading(false);
  };

  function handleSelectEntry(item: HistoryItem): void {
    throw new Error("Function not implemented.");
  }

  return (
    <DashboardLayout
      chat={chat}
      setChat={setChat}
      // onSelectEntry={handleSelectEntry}
    >
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">ProCon – Contract Assistant</h1>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

          {/* 👤 Not signed in */}
          <SignedOut>
            <div className="text-center mt-16">
              <p className="text-xl text-gray-700 mb-4">
                Please sign in to use ProCon.
              </p>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* ✅ Signed in */}
          <SignedIn>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded mb-4"
              placeholder="Paste your contract or policy here..."
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />

            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-300 rounded p-4 bg-white">
              {chat.map((entry, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${
                    entry.role === "user" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  <strong>{entry.role === "user" ? "You" : "ProCon"}:</strong>{" "}
                  {entry.content}
                </div>
              ))}
            </div>

            <div className="flex mt-4">
              <input
                className="flex-grow border border-gray-300 p-2 rounded"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                onClick={askAI}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </SignedIn>
        </div>
      </div>
    </DashboardLayout>
  );
}
