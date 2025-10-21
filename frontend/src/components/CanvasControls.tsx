import React from "react";

interface Props {
  selectedTemplate: "modern" | "elegant";
  theme: { primary: string; fontFamily: string };
  onTemplateChange: (t: "modern" | "elegant") => void;
  onThemeChange: (updates: Partial<{ primary: string; fontFamily: string }>) => void;
}

export default function CanvasControls({
  selectedTemplate,
  theme,
  onTemplateChange,
  onThemeChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm border w-full justify-center">
      <div className="flex gap-3 items-center">
        <span className="text-gray-700 font-medium mr-2">Template:</span>
        {["modern", "elegant"].map((t) => (
          <button
            key={t}
            onClick={() => onTemplateChange(t as "modern" | "elegant")}
            className={`px-3 py-1 rounded-md border text-sm font-medium transition ${
              selectedTemplate === t
                ? "bg-blue-100 border-blue-400 text-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <label className="text-gray-700 font-medium">Primary Color:</label>
        <input
          type="color"
          value={theme.primary}
          onChange={(e) => onThemeChange({ primary: e.target.value })}
          className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-full shadow-sm"
        />
      </div>

      <div className="flex gap-2 items-center">
        <label className="text-gray-700 font-medium">Font:</label>
        <select
          value={theme.fontFamily}
          onChange={(e) => onThemeChange({ fontFamily: e.target.value })}
          className="px-3 py-2 border rounded-md bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Poppins, sans-serif">Poppins</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Times New Roman, serif">Times New Roman</option>
        </select>
      </div>
    </div>
  );
}
