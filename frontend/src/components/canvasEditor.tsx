import React, { useRef, useState, useEffect, useCallback } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import CanvasPreview from "./CanvasPreview";
import ExperienceEntry from "./ExperienceEntry";
import ProjectEntry from "./ProjectEntry";
import EducationEntry from "./EducationEntry";

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

export default function CanvasEditor({ onDataChange }: CanvasEditorProps) {
  const stageRef = useRef<any>(null);

  const initialProjectsArray: ProjectItem[] = [
    {
      title: "Resume Builder App",
      techStack: "React, Node.js",
      description: "Built full MERN stack resume builder with live preview.",
      link: "",
    },
  ];

  const initialEducationArray: EducationItem[] = [
    {
      degree: "B.E. in Computer Engineering",
      institution: "TCET",
      year: "2022–2024",
      cgpa: "8.5",
      details: "",
    },
  ];

  const [resume, setResume] = useState<ResumeData>({
    name: "Arnav Singh",
    designation: "Frontend Developer",
    summary:
      "Passionate frontend developer skilled in React, TypeScript, and UI design. Experienced in building responsive, interactive applications.",
    experience: [
      {
        title: "Frontend Developer",
        company: "Coding Community",
        period: "2024–Present",
        location: "Mumbai, India",
        description:
          "Built scalable UI with React and Tailwind CSS.\nIntegrated real-time APIs with Socket.IO.\nLed responsive design initiatives.",
      },
    ],
    skills: [
      { name: "React", level: "Advanced" },
      { name: "TypeScript", level: "Intermediate" },
    ],
    projectsArray: initialProjectsArray,
    educationArray: initialEducationArray,
    projects: formatProjects(initialProjectsArray),
    education: formatEducation(initialEducationArray),
    contact:
      "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
    tempSkills: "",
  });

  const [theme, setTheme] = useState<Theme>({
    primary: "#2563eb",
    fontFamily: "Poppins, sans-serif",
  });

  const [selectedTemplate, setSelectedTemplate] =
    useState<"modern" | "elegant">("modern");

  // Notify parent when data changes
  const handleDataChange = useCallback(() => {
    if (onDataChange) onDataChange({ resume, theme });
  }, [onDataChange, resume, theme]);

  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  // ✏️ On-canvas editing handler
  const handleEdit = (
    field: string,
    value: string,
    e: KonvaEventObject<MouseEvent>
  ) => {
    const stage = stageRef.current.getStage();
    const absPos = e.target.getAbsolutePosition();
    const container = stage.container();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = value;

    Object.assign(textarea.style, {
      position: "absolute",
      top: `${container.offsetTop + absPos.y}px`,
      left: `${container.offsetLeft + absPos.x}px`,
      width: "420px",
      fontSize: "16px",
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
    });

    textarea.focus();

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    autoResize();
    textarea.addEventListener("input", autoResize);

    const save = () => {
      setResume((prev) => ({ ...prev, [field]: textarea.value }));
      document.body.removeChild(textarea);
    };

    textarea.addEventListener("blur", save);
    textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") document.body.removeChild(textarea);
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-8 w-full">
      {/* 🎨 Template Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm border w-full justify-center">
        <div className="flex gap-3 items-center">
          <span className="text-gray-700 font-medium mr-2">Template:</span>
          {["modern", "elegant"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTemplate(t as "modern" | "elegant")}
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
            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
            className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-full shadow-sm"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Font:</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
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

      {/* 🧾 Canvas Preview */}
      <CanvasPreview
        stageRef={stageRef}
        resume={resume}
        theme={theme}
        selectedTemplate={selectedTemplate}
        onEdit={handleEdit}
      />

      {/* 🧠 Editable Form */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Basic Information
          </h2>
          {["name", "designation", "summary", "contact"].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-gray-700 capitalize mb-1">
                {field}
              </label>
              <textarea
                value={(resume as any)[field]}
                onChange={(e) =>
                  setResume({ ...resume, [field]: e.target.value })
                }
                className="w-full border rounded-md p-2 bg-gray-50"
                rows={field === "summary" || field === "contact" ? 3 : 1}
              />
            </div>
          ))}
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Experience
          </h2>
          {resume.experience.map((exp, idx) => (
            <ExperienceEntry
              key={idx}
              entry={exp}
              onChange={(field: string, value: string) => {
                const updated = [...resume.experience];
                updated[idx] = { ...updated[idx], [field]: value };
                setResume({ ...resume, experience: updated });
              }}
              onDelete={() => {
                const updated = resume.experience.filter((_, i) => i !== idx);
                setResume({ ...resume, experience: updated });
              }}
            />
          ))}
          <button
            onClick={() =>
              setResume({
                ...resume,
                experience: [
                  ...resume.experience,
                  {
                    title: "",
                    company: "",
                    period: "",
                    location: "",
                    description: "",
                  },
                ],
              })
            }
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
          >
            + Add Experience
          </button>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Projects</h2>
          {resume.projectsArray.map((proj, idx) => (
            <ProjectEntry
              key={idx}
              entry={proj}
              onChange={(field, value) => {
                const updated = [...resume.projectsArray];
                updated[idx] = { ...updated[idx], [field]: value };
                setResume({
                  ...resume,
                  projectsArray: updated,
                  projects: formatProjects(updated),
                });
              }}
              onDelete={() => {
                const updated = resume.projectsArray.filter((_, i) => i !== idx);
                setResume({
                  ...resume,
                  projectsArray: updated,
                  projects: formatProjects(updated),
                });
              }}
            />
          ))}
          <button
            onClick={() => {
              const updated = [
                ...resume.projectsArray,
                { title: "", techStack: "", description: "", link: "" },
              ];
              setResume({
                ...resume,
                projectsArray: updated,
                projects: formatProjects(updated),
              });
            }}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
          >
            + Add Project
          </button>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Skills</h2>
          <textarea
            value={
              resume.tempSkills !== undefined
                ? resume.tempSkills
                : resume.skills.map((s) => `${s.name} (${s.level})`).join(", ")
            }
            onChange={(e) =>
              setResume((prev) => ({
                ...prev,
                tempSkills: e.target.value,
              }))
            }
            onBlur={(e) => {
              const text = e.target.value.trim();
              if (!text) {
                setResume((prev) => ({ ...prev, skills: [], tempSkills: "" }));
                return;
              }
              const parsed = text.split(",").map((s) => {
                const match = s.match(/(.*)\((.*)\)/);
                return match
                  ? { name: match[1].trim(), level: match[2].trim() }
                  : { name: s.trim(), level: "Intermediate" };
              });
              setResume((prev) => ({ ...prev, skills: parsed, tempSkills: "" }));
            }}
            className="w-full border rounded-md p-2 bg-gray-50"
            rows={2}
            placeholder="e.g. React (Advanced), TypeScript (Intermediate)"
          />
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Education</h2>
          {resume.educationArray.map((edu, idx) => (
            <EducationEntry
              key={idx}
              entry={edu}
              onChange={(field, value) => {
                const updated = [...resume.educationArray];
                updated[idx] = { ...updated[idx], [field]: value };
                setResume({
                  ...resume,
                  educationArray: updated,
                  education: formatEducation(updated),
                });
              }}
              onDelete={() => {
                const updated = resume.educationArray.filter((_, i) => i !== idx);
                setResume({
                  ...resume,
                  educationArray: updated,
                  education: formatEducation(updated),
                });
              }}
            />
          ))}
          <button
            onClick={() => {
              const updated = [
                ...resume.educationArray,
                {
                  degree: "",
                  institution: "",
                  year: "",
                  cgpa: "",
                  details: "",
                },
              ];
              setResume({
                ...resume,
                educationArray: updated,
                education: formatEducation(updated),
              });
            }}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
          >
            + Add Education
          </button>
        </div>
      </div>
    </div>
  );
}
