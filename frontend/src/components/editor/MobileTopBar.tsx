import React from "react";

interface MobileTopBarProps {
  onOpenTemplates: () => void;
  onOpenDesign: () => void;
}

export default function MobileTopBar({ onOpenTemplates, onOpenDesign }: MobileTopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          onClick={onOpenTemplates}
          className="px-3 py-1 bg-indigo-500 text-white rounded text-xs font-medium"
        >
          Templates
        </button>
        <button
          onClick={onOpenDesign}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium"
        >
          Design
        </button>
      </div>
    </div>
  );
}


