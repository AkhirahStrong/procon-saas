import React from "react";

// 🧾 Define the type for a single chat item
interface ChatItem {
  id: string;
  question: string;
  answer: string;
  bookmarked: boolean;
}

// 💬 Props for ChatHistory
interface ChatHistoryProps {
  chat: ChatItem[];
  setChat: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}

export default function ChatHistory({ chat, setChat }: ChatHistoryProps) {
  return (
    <div className="space-y-4">
      {chat.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded shadow bg-white relative"
        >
          {/* 🟦 Question */}
          <p className="text-sm text-gray-600">
            <strong>Q:</strong> {item.question}
          </p>

          {/* 🟩 Answer */}
          <pre className="whitespace-pre-wrap mt-2 text-gray-800">
            {item.answer}
          </pre>

          {/* ⭐ Toggle Bookmark Button */}
          <button
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition ${
              item.bookmarked ? "bg-yellow-300" : "bg-gray-200"
            }`}
            onClick={async () => {
              try {
                const res = await fetch("/api/bookmark", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: item.id,
                    bookmarked: !item.bookmarked,
                  }),
                });

                if (res.ok) {
                  setChat((prev: ChatItem[]) =>
                    prev.map((msg) =>
                      msg.id === item.id
                        ? { ...msg, bookmarked: !msg.bookmarked }
                        : msg
                    )
                  );
                } else {
                  console.error("Failed to update bookmark");
                }
              } catch (error) {
                console.error("Bookmark error:", error);
              }
            }}
          >
            {item.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>
      ))}
    </div>
  );
}
