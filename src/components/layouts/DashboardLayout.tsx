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
  const [chat, setChat] = useState<HistoryItem[]>([]); // 🛠️ Add the type here

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

  return (
    <div className="flex">
      <Sidebar chat={chat} setChat={setChat} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
