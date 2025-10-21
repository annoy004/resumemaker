import React from "react";

export type TemplateKey = "modern" | "elegant" | "professional" | "creative" | "minimal";

interface TemplateSelectorProps {
  selectedTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
}

const templates = [
  {
    id: "modern" as TemplateKey,
    name: "Modern",
    description: "Clean and contemporary design",
    icon: "📄",
    preview: "Two-column layout with bold headers",
    color: "#2563EB"
  },
  {
    id: "elegant" as TemplateKey,
    name: "Elegant",
    description: "Centered, sophisticated layout",
    icon: "✨",
    preview: "Centered design with elegant accents",
    color: "#7C3AED"
  },
  {
    id: "professional" as TemplateKey,
    name: "Professional",
    description: "Traditional business style",
    icon: "💼",
    preview: "Classic format for corporate roles",
    color: "#059669"
  },
  {
    id: "creative" as TemplateKey,
    name: "Creative",
    description: "Bold and eye-catching",
    icon: "🎨",
    preview: "Stand out with unique styling",
    color: "#DC2626"
  },
  {
    id: "minimal" as TemplateKey,
    name: "Minimal",
    description: "Simple and focused",
    icon: "⚪",
    preview: "Less is more approach",
    color: "#0F172A"
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="w-full bg-white shadow-sm sm:shadow-lg rounded-lg sm:rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-4 border-b">
        <h2 className="text-sm sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">📋</span>
          <span className="truncate">Choose Template</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1 hidden sm:block">
          Select a design that fits your style
        </p>
      </div>

      {/* Templates Grid - Responsive */}
      <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-none overflow-y-auto">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`w-full text-left p-2.5 sm:p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm active:shadow-md"
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl ${
                  selectedTemplate === template.id
                    ? "bg-white shadow-sm"
                    : "bg-gray-50"
                }`}
                style={{
                  backgroundColor: selectedTemplate === template.id ? template.color + "15" : undefined
                }}
              >
                {template.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {template.name}
                  </h3>
                  {selectedTemplate === template.id && (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-none">
                  {template.description}
                </p>
                <p className="text-xs text-gray-500 italic line-clamp-1 sm:line-clamp-none">
                  {template.preview}
                </p>
              </div>
            </div>

            {/* Preview Indicator */}
            {selectedTemplate === template.id && (
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-200 hidden sm:block">
                <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Currently viewing
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t">
        <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="hidden xs:inline">Your content stays the same across all templates</span>
          <span className="xs:hidden">Content stays same everywhere</span>
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;