// src/components/layouts/DashboardLayout.tsx
import { useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchUserHistory } from "@/utils/fetchHistory";
import Sidebar from "../ui/sidebar";
import { HistoryItem } from "@/types/history";

type DashboardLayoutProps = {
  children: ReactNode;
  chat: HistoryItem[];
  setChat: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  const [chat, setChat] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) {
        const history = await fetchUserHistory(email);
        setChat(history);
      }
    };

    loadHistory();
  }, [user?.primaryEmailAddress?.emailAddress]);

  // ✅ Add this function
  function onSelectEntry(item: HistoryItem) {
    console.log("📌 Selected chat from sidebar/search modal:", item);
    // You can do more with this, like lifting it up
  }

  return (
    <div className="flex">
      <Sidebar chat={chat} setChat={setChat} onSelectEntry={onSelectEntry} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
