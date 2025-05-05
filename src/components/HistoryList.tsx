import { HistoryItem } from "@/types/history";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";

type HistoryListProps = {
  chat: HistoryItem[];
  setChat: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  onSelect: (item: HistoryItem) => void;
};

const groupByDate = (items: HistoryItem[]) => {
  const groups: { [key: string]: HistoryItem[] } = {};

  items.forEach((item) => {
    const date = parseISO(item.created_at);
    let key = "Earlier";

    if (isToday(date)) key = "Today";
    else if (isYesterday(date)) key = "Yesterday";
    else if (isThisWeek(date)) key = "Previous 7 Days";

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return groups;
};

export default function HistoryList({
  chat,
  setChat,
  onSelect,
}: HistoryListProps) {
  const grouped = groupByDate(chat);

  if (chat.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400 mt-4">
        No history yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {["Today", "Yesterday", "Previous 7 Days", "Earlier"].map((label) =>
        grouped[label] ? (
          <div key={label}>
            <h3 className="text-xs uppercase text-gray-400 mb-2">{label}</h3>
            <ul className="space-y-2">
              {grouped[label].map((item) => (
                <li
                  key={item.id}
                  className="bg-gray-800 p-3 rounded text-sm hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelect(item)}
                >
                  <strong className="block truncate">{item.question}</strong>
                  <span className="text-gray-400 text-xs">
                    {format(parseISO(item.created_at), "MMM d, h:mm a")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
