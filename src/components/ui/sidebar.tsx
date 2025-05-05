// src/components/ui/Sidebar.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import HistoryList from "@/components/HistoryList";
import { HistoryItem } from "@/types/history";

type SidebarProps = {
  chat: HistoryItem[];
  setChat: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
};

export default function Sidebar({ chat, setChat }: SidebarProps) {
  return (
    <aside className="w-[280px] bg-gray-900 text-white h-screen flex flex-col border-r border-gray-800">
      {/* 🔍 Top search bar */}
      <div className="p-4 border-b border-gray-800">
        <Input
          placeholder="Search..."
          className="w-full bg-white text-black placeholder-gray-500"
        />
      </div>

      {/* 🗂 Scrollable history list */}
      <ScrollArea className="flex-1 p-4">
        <HistoryList chat={chat} setChat={setChat} />
      </ScrollArea>

      {/* ➕ Upload button */}
      <div className="p-4 border-t border-gray-800">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          onClick={() => {
            // Optional: wire this to trigger a modal or scroll to file upload
            const uploadSection = document.querySelector("#file-upload");
            uploadSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Plus className="w-4 h-4" />
          Upload File
        </button>
      </div>
    </aside>
  );
}
