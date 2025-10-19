import React from "react";

interface ProjectEntryProps {
  entry: {
    title: string;
    techStack: string;
    description: string;
    link: string;
  };
  onChange: (field: string, value: string) => void;
  onDelete: () => void;
}

export default function ProjectEntry({ entry, onChange, onDelete }: ProjectEntryProps) {
  return (
    <div className="p-3 border rounded-md mb-3 bg-gray-50 shadow-sm">
      <input
        type="text"
        placeholder="Project Title"
        value={entry.title}
        onChange={(e) => onChange("title", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <input
        type="text"
        placeholder="Tech Stack (e.g. React, Node.js)"
        value={entry.techStack}
        onChange={(e) => onChange("techStack", e.target.value)}
        className="w-full border-b mb-2 outline-none bg-transparent"
      />
      <textarea
        placeholder="Description"
        value={entry.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full border p-2 outline-none rounded bg-white mb-2"
      />
      <input
        type="text"
        placeholder="Project Link (optional)"
        value={entry.link}
        onChange={(e) => onChange("link", e.target.value)}
        className="w-full border-b outline-none bg-transparent"
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
