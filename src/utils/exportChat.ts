export function exportChatAsText(chat: any[], onlyBookmarked = false) {
  const filtered = onlyBookmarked ? chat.filter((c) => c.bookmarked) : chat;

  const content = filtered
    .map((entry) => {
      return `🧠 Question:\n${entry.question}\n\n💬 Answer:\n${entry.answer}\n\n---\n`;
    })
    .join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = onlyBookmarked ? "procon_bookmarked.txt" : "procon_history.txt";
  a.click();
  URL.revokeObjectURL(url);
}
