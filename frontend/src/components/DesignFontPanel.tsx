import React, { useState } from "react";

export interface Theme {
  primary: string;
  fontFamily: string;
  fontSize?: number;
  lineHeight?: number;
  pageMargin?: number;
  sectionSpacing?: number;
}

interface DesignFontPanelProps {
  theme: Theme;
  onThemeChange: (updates: Partial<Theme>) => void;
}

const DesignFontPanel: React.FC<DesignFontPanelProps> = ({ theme, onThemeChange }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const colors = [
    "#000000", "#1E293B", "#047857", "#DC2626",
    "#2563EB", "#3B82F6", "#F97316", "#9333EA", "#B45309"
  ];

  const fonts = ["Rubik", "Inter", "Poppins", "Roboto", "Open Sans"];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

const isExpanded = (section: string) => expandedSection === section;


  return (
    <div className="w-full sm:w-72 bg-white shadow-sm sm:shadow-lg rounded-lg overflow-hidden">
      {/* Header - Responsive Padding */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">Design & Font</h2>
        <p className="text-xs text-gray-600 mt-0.5">Customize your resume</p>
      </div>

      {/* Content - Scrollable on Mobile */}
      <div className="p-2.5 sm:p-4 space-y-2.5 sm:space-y-5 max-h-[calc(100vh-250px)] sm:max-h-none overflow-y-auto">
        
        {/* PAGE MARGINS */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("margin")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">
              PAGE MARGINS: <span className="text-blue-600">{theme.pageMargin ?? 4}</span>
            </h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("margin") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("margin") && (
            <div className="px-3 py-2 sm:py-2.5 border-t border-gray-200 bg-white">
              <input
                type="range"
                min="1"
                max="8"
                value={theme.pageMargin ?? 4}
                onChange={(e) => onThemeChange({ pageMargin: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                <span>Narrow</span>
                <span>Wide</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION SPACING */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("spacing")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">
              SECTION SPACING: <span className="text-blue-600">{theme.sectionSpacing ?? 2}</span>
            </h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("spacing") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("spacing") && (
            <div className="px-3 py-2 sm:py-2.5 border-t border-gray-200 bg-white">
              <input
                type="range"
                min="1"
                max="8"
                value={theme.sectionSpacing ?? 2}
                onChange={(e) => onThemeChange({ sectionSpacing: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                <span>Compact</span>
                <span>More Space</span>
              </div>
            </div>
          )}
        </div>

        {/* COLORS */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("colors")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">COLORS</h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("colors") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("colors") && (
            <div className="px-3 py-2.5 sm:py-3 border-t border-gray-200 bg-white">
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onThemeChange({ primary: color })}
                    className={`h-8 w-8 sm:h-6 sm:w-6 rounded-full border-2 touch-manipulation transition-all hover:scale-110 active:scale-95 ${
                      theme.primary === color ? "border-blue-600 scale-110 shadow-lg" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FONT STYLE */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("font")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">FONT STYLE</h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("font") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("font") && (
            <div className="px-3 py-2 sm:py-2.5 border-t border-gray-200 bg-white">
              <select
                value={theme.fontFamily}
                onChange={(e) => onThemeChange({ fontFamily: e.target.value })}
                className="w-full text-xs sm:text-sm border border-gray-300 rounded-md p-2 sm:p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-transparent touch-manipulation"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* FONT SIZE */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("fontSize")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">
              FONT SIZE: <span className="text-blue-600">{theme.fontSize ?? 3}</span>
            </h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("fontSize") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("fontSize") && (
            <div className="px-3 py-2 sm:py-2.5 border-t border-gray-200 bg-white">
              <input
                type="range"
                min="1"
                max="5"
                value={theme.fontSize ?? 3}
                onChange={(e) => onThemeChange({ fontSize: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          )}
        </div>

        {/* LINE HEIGHT */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("lineHeight")}
            className="w-full px-3 py-2 sm:py-2.5 flex items-center justify-between hover:bg-gray-50 transition touch-manipulation"
          >
            <h3 className="text-xs sm:text-sm text-gray-700 font-semibold">
              LINE HEIGHT: <span className="text-blue-600">{(theme.lineHeight ?? 1).toFixed(1)}</span>
            </h3>
            <svg
              className={`w-4 h-4 sm:hidden transition-transform flex-shrink-0 ${
                isExpanded("lineHeight") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {isExpanded("lineHeight") && (
            <div className="px-3 py-2 sm:py-2.5 border-t border-gray-200 bg-white">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={theme.lineHeight ?? 1}
                onChange={(e) => onThemeChange({ lineHeight: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                <span>Condensed</span>
                <span>Spacious</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignFontPanel;