import React from "react";

interface EducationEntryProps {
  entry: {
    degree: string;
    institution: string;
    year: string;
    cgpa: string;
    details: string;
  };
  onChange: (field: string, value: string) => void;
  onDelete: () => void;
}

export default function EducationEntry({ entry, onChange, onDelete }: EducationEntryProps) {
  return (
    <div className="p-3 border rounded-md mb-3 bg-gray-50 shadow-sm">
      <input
        type="text"
        placeholder="Degree (e.g. B.E. in Computer Engineering)"
        value={entry.degree}
        onChange={(e) => onChange("degree", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Institution Name"
        value={entry.institution}
        onChange={(e) => onChange("institution", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Year or Duration (e.g. 2020–2024)"
        value={entry.year}
        onChange={(e) => onChange("year", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="CGPA or Percentage"
        value={entry.cgpa}
        onChange={(e) => onChange("cgpa", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <textarea
        placeholder="Additional Details (optional)"
        value={entry.details}
        onChange={(e) => onChange("details", e.target.value)}
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
