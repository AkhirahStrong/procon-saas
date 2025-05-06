// src/components/ui/SearchPanel.tsx
"use client";

import { useEffect, useRef } from "react";
import { HistoryItem } from "@/types/history";
import { X } from "lucide-react";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
  chat: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchPanel({
  open,
  onClose,
  chat,
  onSelect,
  searchTerm,
  setSearchTerm,
}: SearchPanelProps) {
  useEffect(() => {
    if (!open) setSearchTerm("");
  }, [open, setSearchTerm]);

  if (!open) return null;

  const filtered = chat.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg w-full h-full md:h-auto md:w-[400px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4">
          <input
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-3 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <strong className="block truncate">{item.question}</strong>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
