// src/components/ExperienceEntry.tsx
import React from "react";

interface ExperienceEntryProps {
  entry: {
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
  };
  onChange: (field: string, value: string) => void;
  onDelete: () => void;
}

export default function ExperienceEntry({ entry, onChange, onDelete }: ExperienceEntryProps) {
  return (
    <div className="p-3 border rounded-md mb-3 bg-gray-50 shadow-sm">
      <input
        type="text"
        placeholder="Job Title"
        value={entry.title}
        onChange={(e) => onChange("title", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Company"
        value={entry.company}
        onChange={(e) => onChange("company", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Period"
        value={entry.period}
        onChange={(e) => onChange("period", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Location"
        value={entry.location}
        onChange={(e) => onChange("location", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <textarea
        placeholder="Description"
        value={entry.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full border p-2 outline-none rounded bg-white"
      />
      <button
        onClick={onDelete}
        className="mt-2 text-sm text-red-500 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
