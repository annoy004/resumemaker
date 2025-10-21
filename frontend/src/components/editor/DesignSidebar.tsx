import React from "react";
import DesignFontPanel, { Theme } from "../DesignFontPanel";

interface DesignSidebarProps {
  theme: Theme;
  onThemeChange: (updates: Partial<Theme>) => void;
}

export default function DesignSidebar({ theme, onThemeChange }: DesignSidebarProps) {
  return (
    <div className="w-1/5 flex-shrink-0 hidden lg:block">
      <div className="sticky top-6 bg-white rounded-lg shadow-sm p-3 max-h-[calc(100vh-100px)] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-gray-800">Design</h3>
        <DesignFontPanel theme={theme} onThemeChange={onThemeChange} />
      </div>
    </div>
  );
}


