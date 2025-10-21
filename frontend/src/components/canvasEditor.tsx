import React, { useRef, useState, useEffect, useCallback } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import CanvasPreview from "./CanvasPreview";
import CanvasSaveShare from "./CanvasSaveShare";
import DesignFontPanel from "./DesignFontPanel";
import TemplateSelector from "./TemplateSelector";
import MobileTopBar from "./editor/MobileTopBar";
import FormsPanel from "./editor/FormsPanel";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { 
  setCurrentResume, 
  updateResumeData, 
  updateResumeTheme, 
  updateResumeTemplate,
  saveResume 
} from "../redux/resumeSlice";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

interface ProjectItem {
  title: string;
  techStack: string;
  description: string;
  link: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
  details: string;
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
  education: string;
  projectsArray: ProjectItem[];
  educationArray: EducationItem[];
  skills: SkillItem[];
  contact: string;
  tempSkills?: string;
}

interface CanvasEditorProps {
  onDataChange?: (data: { resume: ResumeData; theme: Theme }) => void;
  onSectionOrderChange?: (order: string[]) => void;
}

const formatProjects = (arr: ProjectItem[]) =>
  arr
    .map(
      (p) =>
        `${p.title}${p.techStack ? ` — ${p.techStack}` : ""}${
          p.link ? `\n${p.link}` : ""
        }\n${p.description}`.trim()
    )
    .join("\n\n");

const formatEducation = (arr: EducationItem[]) =>
  arr
    .map(
      (e) =>
        `${e.degree}\n${e.institution} (${e.year})${
          e.cgpa ? ` — CGPA: ${e.cgpa}` : ""
        }${e.details ? `\n${e.details}` : ""}`.trim()
    )
    .join("\n\n");

export default function CanvasEditor({ onDataChange, onSectionOrderChange }: CanvasEditorProps) {
  const stageRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const currentResume = useAppSelector((state) => state.resumes.currentResume);
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Use Redux state as the single source of truth
  const resume: ResumeData = currentResume?.data || {
    name: "Arnav Singh",
    designation: "Frontend Developer",
    summary: "Passionate frontend developer skilled in React, TypeScript, and UI design. Experienced in building responsive, interactive applications.",
    experience: [
      {
        title: "Frontend Developer",
        company: "Coding Community",
        period: "2024–Present",
        location: "Mumbai, India",
        description: "Built scalable UI with React and Tailwind CSS.\nIntegrated real-time APIs with Socket.IO.\nLed responsive design initiatives.",
      },
    ],
    skills: [
      { name: "React", level: "Advanced" },
      { name: "TypeScript", level: "Intermediate" },
    ],
    projectsArray: [
      {
        title: "Resume Builder App",
        techStack: "React, Node.js",
        description: "Built full MERN stack resume builder with live preview.",
        link: "",
      },
    ],
    educationArray: [
      {
        degree: "B.E. in Computer Engineering",
        institution: "TCET",
        year: "2022–2024",
        cgpa: "8.5",
        details: "",
      },
    ],
    projects: "",
    education: "",
    contact: "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
    tempSkills: "",
  };

  const theme: Theme = currentResume?.theme || {
    primary: "#2563eb",
    fontFamily: "Poppins, sans-serif",
    fontSize: 3,
    lineHeight: 1.6,
    pageMargin: 4,
    sectionSpacing: 2,
  };

  const selectedTemplate = (currentResume?.template as any) || "modern";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTemplateSidebarOpen, setIsTemplateSidebarOpen] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
    "contact",
  ]);

  // Auto-save to backend every 10 seconds
  useEffect(() => {
    if (!currentResume?.id) return;
    console.log(resume);

    const interval = setInterval(() => {
    dispatch(saveResume({ 
  resumeId: currentResume.id, 
  data: { ...resume, theme, template: selectedTemplate } 
}));

    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(interval);
  }, [dispatch, currentResume?.id, resume, theme, selectedTemplate]);

  const handleEdit = (
    field: string,
    value: string,
    e: KonvaEventObject<MouseEvent>
  ) => {
    // Prevent any additional handlers from firing
    e.cancelBubble = true;
    // @ts-ignore
    if (e.evt && typeof e.evt.preventDefault === "function") e.evt.preventDefault();

    const stage = stageRef.current.getStage();
    const absPos = e.target.getAbsolutePosition();
    const container = stage.container();
    const rect = container.getBoundingClientRect();
    const scaleX = stage.scaleX?.() ?? 1;
    const scaleY = stage.scaleY?.() ?? 1;

    // Remove existing editor if present to avoid duplicates
    const existing = document.getElementById("konva-inline-editor");
    if (existing && existing.parentElement) existing.parentElement.removeChild(existing);

    const textarea = document.createElement("textarea");
    textarea.id = "konva-inline-editor";
    document.body.appendChild(textarea);
    textarea.value = value;

    const computedFontSize = (typeof (e.target as any).fontSize === "function"
      ? (e.target as any).fontSize() * scaleY
      : 16);

    Object.assign(textarea.style, {
      position: "absolute",
      top: `${window.scrollY + rect.top + absPos.y * scaleY}px`,
      left: `${window.scrollX + rect.left + absPos.x * scaleX}px`,
      width: "min(90vw, 520px)",
      maxWidth: "90vw",
      fontSize: `${computedFontSize}px`,
      zIndex: "1000",
      padding: "8px 10px",
      border: `2px solid ${theme.primary}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
      background: "#fff",
      fontFamily: theme.fontFamily,
      color: "#1f2937",
      resize: "none",
      lineHeight: "1.5",
      outline: "none",
    } as Partial<CSSStyleDeclaration>);

    textarea.focus();

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    autoResize();
    textarea.addEventListener("input", autoResize);

    const save = () => {
      const newValue = textarea.value.replace(/\s+$/m, "");
        if (field === "experience") {
        const parsed = newValue
          .split(/\n\n+/)
          .map((block) => block.trim())
          .filter((block) => block.length > 0)
          .map((block) => {
            const lines = block.split("\n");
            return {
              title: lines[0] || "",
              company: lines[1] || "",
              period: lines[2] || "",
              location: lines[3] || "",
              description: lines.slice(4).join("\n").trim(),
            };
          });
        dispatch(updateResumeData({ experience: parsed }));
      } else if (field === "skills") {
          const parsed = newValue.split(",").map((s) => {
            const match = s.match(/(.*)\((.*)\)/);
            return match
              ? { name: match[1].trim(), level: match[2].trim() }
              : { name: s.trim(), level: "Intermediate" };
          });
        dispatch(updateResumeData({ skills: parsed }));
      } else {
        dispatch(updateResumeData({ [field]: newValue }));
        }

      if (textarea.parentElement) textarea.parentElement.removeChild(textarea);
    };

    textarea.addEventListener("blur", save);
    textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (textarea.parentElement) textarea.parentElement.removeChild(textarea);
      }
    });
  };

  const handleDataChange = useCallback(() => {
    onDataChange?.({ resume, theme });
  }, [resume, theme, onDataChange]);

  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  const toggleSection = (section: string) => {
    const updated = new Set(expandedSections);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    setExpandedSections(updated);
  };

  // Custom setResume function that uses Redux
  const setResume = (updater: any) => {
    if (typeof updater === 'function') {
      const newData = updater(resume);
      dispatch(updateResumeData(newData));
    } else {
      dispatch(updateResumeData(updater));
    }
  };


  return (
    <div className="w-full min-h-screen bg-gray-50">
      {isTemplateSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsTemplateSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-3 flex items-center justify-between z-10">
              <h2 className="text-base font-semibold text-gray-800">Templates</h2>
              <button
                onClick={() => setIsTemplateSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={(template) => {
                  dispatch(updateResumeTemplate(template));
                  setIsTemplateSidebarOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-3 flex items-center justify-between z-10">
              <h2 className="text-base font-semibold text-gray-800">Design</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <DesignFontPanel
                theme={theme}
                onThemeChange={(updates) => {
                  dispatch(updateResumeTheme(updates));
                }}
              />
            </div>
          </div>
        </div>
      )}

      <MobileTopBar
        onOpenTemplates={() => setIsTemplateSidebarOpen(true)}
        onOpenDesign={() => setIsSidebarOpen(true)}
      />

      {/* Mobile & Tablet Layout: Single Column */}
      <div className="lg:hidden w-full px-2 sm:px-4 py-3 space-y-3">
        {/* Save & Share */}
        <div className="w-full">
          <CanvasSaveShare resume={resume} theme={theme} template={selectedTemplate} />
        </div>

        {/* Canvas */}
        <div className="w-full overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-1 sm:p-2">
          <CanvasPreview
            stageRef={stageRef}
            resume={resume}
            theme={theme}
            selectedTemplate={selectedTemplate}
            onEdit={handleEdit}
            sectionOrder={sectionOrder}
            onSectionOrderChange={(newOrder) => {
              setSectionOrder(newOrder);
              onSectionOrderChange?.(newOrder);
            }}
          />
        </div>

        {/* Forms */}
        <FormsPanel
          wrapperClassName="w-full space-y-2"
          resume={resume}
          setResume={setResume as any}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          formatProjects={formatProjects as any}
          formatEducation={formatEducation as any}
        />
      </div>

      {/* Desktop Layout: Stack canvas then forms (no persistent sidebars) */}
      <div className="hidden lg:block w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6 max-w-[1200px] mx-auto">
        <div className="w-full mb-4">
          <CanvasSaveShare resume={resume} theme={theme} template={selectedTemplate} />
        </div>
        <div className="w-full overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-3">
            <CanvasPreview
              stageRef={stageRef}
              resume={resume}
              theme={theme}
              selectedTemplate={selectedTemplate}
              onEdit={handleEdit}
              sectionOrder={sectionOrder}
              onSectionOrderChange={(newOrder) => {
                setSectionOrder(newOrder);
                onSectionOrderChange?.(newOrder);
              }}
            />
          </div>
        <div className="mt-6">
          <FormsPanel
            wrapperClassName="w-full space-y-3"
            resume={resume}
            setResume={setResume as any}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            formatProjects={formatProjects as any}
            formatEducation={formatEducation as any}
          />
        </div>
      </div>
    </div>
  );
}