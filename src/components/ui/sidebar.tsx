"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Plus, Search, PenLine } from "lucide-react";
import HistoryList from "@/components/HistoryList";
import { HistoryItem } from "@/types/history";
import SearchModal from "@/components/ui/SearchModal";
import SearchPanel from "./SearchPanel";
type SidebarProps = {
  chat: HistoryItem[];
  setChat: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  onSelectEntry?: (item: HistoryItem) => void;
};

export default function Sidebar({
  chat,
  setChat,
  onSelectEntry,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  //  Toggle collapsed state
  const toggleCollapsed = () => setCollapsed(!collapsed);

  //Optional: handle new chat click
  const onNewChat = () => {
    //You can clear current document/question state here via a callback if needed
    console.log("🆕 Start new chat");
  };

  //State for the modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <aside
      className={`${
        collapsed ? "w-[60px]" : "w-[280px]"
      } bg-gray-900 text-white h-screen flex flex-col border-r border-gray-800 transition-all duration-200`}
    >
      {/* 🔝 Top icon bar */}
      <div
        className={`flex ${
          collapsed
            ? "flex-col items-center gap-4"
            : "flex-row items-center justify-between"
        } p-4 border-b border-gray-800`}
      >
        {/* ☰ Collapse toggle */}
        <button onClick={toggleCollapsed} title="Toggle Sidebar">
          <LayoutDashboard className="w-5 h-5" />
        </button>

        {/* 🔍 Search icon */}
        <button onClick={() => setSearchOpen(true)} title="Search">
          <Search className="w-5 h-5" />
        </button>

        {/* ✏️ New Chat icon */}
        <button onClick={onNewChat} title="New Chat">
          <PenLine className="w-5 h-5" />
        </button>
      </div>

      {/* 📜 Scrollable history - only if expanded */}
      {!collapsed && (
        <ScrollArea className="flex-1 p-4">
          <HistoryList
            chat={chat}
            setChat={setChat}
            onSelect={onSelectEntry || (() => {})}
          />
        </ScrollArea>
      )}

      {/* ➕ Upload Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          className={`w-full flex items-center justify-center ${
            collapsed ? "p-2" : "gap-2 px-4 py-2"
          } bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm`}
          onClick={() => {
            const uploadSection = document.querySelector("#file-upload");
            uploadSection?.scrollIntoView({ behavior: "smooth" });
          }}
          title="Upload File"
        >
          <Plus className="w-4 h-4" />
          {!collapsed && "Upload File"}
        </button>
      </div>

      <SearchPanel
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchTerm("");
        }}
        chat={chat}
        onSelect={onSelectEntry || (() => {})}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </aside>
  );
}
