import React, { useEffect, useState } from "react";
import { Stage } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import ModernTemplate from "../temp/ModernTemplate";
import ElegantTemplate from "../temp/ElegantTemplate";
import ProfessionalTemplate from "../temp/ProfessionalTemplate";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

interface SkillItem {
  name: string;
  level: string;
}

interface Theme {
  primary: string;
  fontFamily: string;
}

interface ResumeData {
  name: string;
  designation: string;
  summary: string;
  experience: ExperienceItem[];
  projects: string;
  skills: SkillItem[];
  education: string;
  contact: string;
}

type TemplateKey = "modern" | "elegant" | "professional" | "creative" | "minimal";

interface CanvasPreviewProps {
  stageRef: React.RefObject<any>;
  resume: ResumeData;
  theme: Theme;
  selectedTemplate: TemplateKey;
  onEdit?: (field: string, value: string, e: KonvaEventObject<MouseEvent>) => void;
  sectionOrder?: string[];
  onSectionOrderChange?: (order: string[]) => void;
}

export default function CanvasPreview({
  stageRef,
  resume,
  theme,
  selectedTemplate,
  onEdit,
  sectionOrder: propSectionOrder,
  onSectionOrderChange,
}: CanvasPreviewProps) {
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    propSectionOrder || ["name", "designation", "summary", "contact", "experience", "skills", "projects", "education"]
  );

  useEffect(() => {
    const calculateDimensions = () => {
      const windowWidth = window.innerWidth;
      const mobile = windowWidth < 640;
      const tablet = windowWidth < 1024 && windowWidth >= 640;
      const tinyMobile = windowWidth < 400; // Extra small screens like 321px
      setIsMobile(mobile);
      setIsTablet(tablet);

      let availableWidth;
      const baseWidth = 600;

      if (tinyMobile) {
        // Very small screens: use almost full width with minimal padding
        availableWidth = windowWidth - 8;
      } else if (windowWidth < 640) {
        // Mobile: nearly full width
        availableWidth = windowWidth - 16;
      } else if (windowWidth < 1024) {
        // Tablet: centered with padding
        availableWidth = Math.min(windowWidth - 40, 550);
      } else {
        // Desktop: proportional to viewport
        availableWidth = Math.min(windowWidth * 0.45, 600);
      }

      const newScale = availableWidth / baseWidth;
      const minScale = tinyMobile ? 0.45 : mobile ? 0.55 : tablet ? 0.65 : 0.7;
      const maxScale = 1;
      const finalScale = Math.min(Math.max(newScale, minScale), maxScale);

      setContainerWidth(availableWidth);
      setScale(finalScale);
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  const formattedExperience = Array.isArray(resume.experience)
    ? resume.experience
        .map(
          (exp) =>
            `${exp.title} - ${exp.company} (${exp.period})\n${exp.location}\n${exp.description}`
        )
        .join("\n\n")
    : "";

  const formattedSkills = Array.isArray(resume.skills)
    ? resume.skills.map((s) => `${s.name} (${s.level})`).join(", ")
    : "";

  const handleEdit = onEdit ?? (() => {});

  const canvasWidth = 600;
  const canvasHeight = 840;
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;

  const moveSectionUp = (section: string) => {
    const index = sectionOrder.indexOf(section);
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setSectionOrder(newOrder);
      onSectionOrderChange?.(newOrder);
    }
  };

  const moveSectionDown = (section: string) => {
    const index = sectionOrder.indexOf(section);
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSectionOrder(newOrder);
      onSectionOrderChange?.(newOrder);
    }
  };

  const renderTemplate = () => {
    const commonProps = {
      name: resume.name,
      designation: resume.designation,
      summary: resume.summary,
      experience: formattedExperience,
      projects: resume.projects,
      skills: formattedSkills,
      education: resume.education,
      contact: resume.contact,
      theme: theme,
      onEdit: handleEdit,
      scale: scale,
      isMobile: isMobile,
      compactMode: isMobile,
      canvasWidth: canvasWidth,
      sectionOrder: sectionOrder,
    };

    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate {...commonProps} />;
      case "elegant":
        return <ElegantTemplate {...commonProps} />;
      case "professional":
        return <ProfessionalTemplate {...commonProps} />;
      case "creative":
        return <ElegantTemplate {...commonProps} />;
      case "minimal":
        return <ModernTemplate {...commonProps} />;
      default:
        return <ModernTemplate {...commonProps} />;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg lg:rounded-xl shadow-sm lg:shadow-lg overflow-hidden flex flex-col">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1">
          <span className="text-blue-500">📄</span>
          Resume Preview
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {isMobile && (
            <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full font-medium">
              Mobile View
            </span>
          )}
          {isTablet && (
            <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
              Tablet View
            </span>
          )}
          <span className="text-xs text-gray-500 bg-white px-1.5 sm:px-2 py-0.5 rounded-full border border-gray-200 font-medium">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-0 lg:gap-4 overflow-hidden">
        {/* Canvas Container - Full width on mobile/tablet, flexible on desktop */}
        <div
          className="flex-1 flex justify-center items-start bg-gradient-to-br from-gray-50 to-gray-100 p-1 sm:p-2 lg:p-4 overflow-auto"
          style={{ minHeight: isMobile ? `${scaledHeight + 16}px` : "auto" }}
        >
          <div
            className="bg-white shadow-lg lg:shadow-xl rounded-lg border border-gray-200"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >{/* @ts-ignore */}
            <Stage
              width={canvasWidth}
              height={canvasHeight}
              scaleX={scale}
              scaleY={scale}
              ref={stageRef}
            >
              {renderTemplate()}
            </Stage>
          </div>
        </div>

        {/* Section Manager - Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-56 flex-col bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Section Order</h3>
          <div className="space-y-2 flex-1">
            {sectionOrder.map((section, index) => (
              <div
                key={section}
                className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 hover:bg-gray-100 transition"
              >
                <span className="text-xs font-medium text-gray-700 capitalize truncate">{section}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveSectionUp(section)}
                    disabled={index === 0}
                    className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveSectionDown(section)}
                    disabled={index === sectionOrder.length - 1}
                    className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">Use arrows to reorder</p>
        </div>
      </div>

      {/* Mobile/Tablet Section Manager Button */}
      {(isMobile || isTablet) && (
        <div className="bg-blue-50 border-t px-3 py-2">
          <button
            onClick={() => setShowSectionManager(!showSectionManager)}
            className="w-full text-xs font-medium text-blue-600 hover:text-blue-700 py-1"
          >
            {showSectionManager ? "Hide Section Order" : "Show Section Order"}
          </button>
        </div>
      )}

      {/* Mobile/Tablet Section Manager Expandable */}
      {(isMobile || isTablet) && showSectionManager && (
        <div className="bg-gray-50 border-t p-3 max-h-64 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">Section Order</h3>
          <div className="flex flex-wrap gap-1.5">
            {sectionOrder.map((section, index) => (
              <div
                key={section}
                className="flex items-center gap-0.5 bg-white px-2 py-1.5 rounded border border-gray-200 text-xs"
              >
                <span className="capitalize font-medium hidden xs:inline">{section}</span>
                <span className="capitalize font-medium xs:hidden">{section.slice(0, 3)}</span>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => moveSectionUp(section)}
                    disabled={index === 0}
                    className="px-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs hover:bg-blue-600 transition"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveSectionDown(section)}
                    disabled={index === sectionOrder.length - 1}
                    className="px-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-xs hover:bg-blue-600 transition"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 sm:px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
          <span className="text-blue-500">💡</span>
          {isMobile ? "Mobile: Scroll to see content" : "Click text to edit"}
        </p>
      </div>
    </div>
  );
}