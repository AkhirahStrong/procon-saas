"use client";

import { useState } from "react";

// FileUpload component accepts a callback `onComplete` which will receive the result after upload & analysis
export default function FileUpload({
  onComplete,
  userEmail,
}: {
  onComplete: (data: any) => void;
  userEmail: string;
}) {
  const [fileName, setFileName] = useState(""); // Stores the uploaded file's name
  const [uploading, setUploading] = useState(false); // Tracks upload/analysis state

  // Handles file input change
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (!file) return;

    // limit file size
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("Please upload a file smaller than 5MB.");
      return;
    }

    setFileName(file.name); // Show file name in UI
    setUploading(true); // Set loading state

    const formData = new FormData(); // Create form data for POST request
    formData.append("file", file); // Append the selected file

    // Send the file to the backend API route
    const res = await fetch(
      `/api/upload-analyze?email=${encodeURIComponent(userEmail)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json(); // Parse response JSON
    setUploading(false); // Reset uploading state

    if (res.ok) {
      onComplete(result); // Pass back OpenAI analysis result (summary, pros, cons, red flags)
    } else {
      alert("Error analyzing file"); // Show error if request failed
      console.error(result);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mb-6">
      <label className="block mb-2 font-medium">
        Upload a file to analyze:
      </label>

      {/* Accept only PDF, DOCX, or TXT */}
      <input
        type="file"
        accept=".pdf,.docx,.txt,.doc"
        onChange={handleUpload}
        disabled={uploading} //Disable input while uploading
      />

      {/* Show file name once selected */}
      {fileName && <p className="mt-2 text-sm text-gray-600">📄 {fileName}</p>}

      {/* Show loading text while analyzing */}
      {uploading && <p className="text-sm text-blue-600 mt-2">Analyzing...</p>}
    </div>
  );
}
