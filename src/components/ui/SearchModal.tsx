// src/components/ui/SearchModal.tsx
"use client";

import { useState, useEffect } from "react";
import { HistoryItem } from "@/types/history";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  chat: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function SearchModal({
  open,
  onClose,
  chat,
  onSelect,
}: SearchModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    const filtered = chat.filter((item) =>
      item.question.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
  }, [search, chat]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search History</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="mb-4"
          />

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-gray-400">No matches found.</p>
            ) : (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="cursor-pointer border p-2 rounded hover:bg-gray-100 text-sm"
                >
                  {item.question}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
