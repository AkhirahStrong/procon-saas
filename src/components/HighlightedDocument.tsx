// src/components/HighlightedDocument.tsx

type Props = {
  rawText: string;
  highlights: string[];
  color?: "red" | "yellow" | "blue";
};

export default function HighlightedDocument({
  rawText,
  highlights,
  color = "red",
}: Props) {
  const colorClassMap: Record<string, string> = {
    red: "bg-red-200 text-black",
    yellow: "bg-yellow-200 text-black",
    blue: "bg-blue-200 text-black",
  };

  const highlightClass = colorClassMap[color] || "bg-red-200";

  // Escape special characters in phrases for regex
  const escapedHighlights = highlights.map((phrase) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  // Build regex to match any of the highlights
  const regex = new RegExp(`(${escapedHighlights.join("|")})`, "gi");

  // Split and re-join with <mark> tag around matches
  const parts = rawText.split(regex);

  return (
    <div className="whitespace-pre-wrap border rounded p-3 bg-white shadow text-sm leading-relaxed">
      {parts.map((part, index) =>
        highlights.some((h) => part.toLowerCase().includes(h.toLowerCase())) ? (
          <mark key={index} className={`${highlightClass} px-1 rounded`}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </div>
  );
}
