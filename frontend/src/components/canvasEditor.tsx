import React, { useRef, useState, useEffect, useCallback } from "react";
import { Stage } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import ModernTemplate from "../temp/ModernTemplate";
import ElegantTemplate from "../temp/ElegantTemplate";
import ExperienceEntry from "./ExperienceEntry";

interface CanvasEditorProps {
  onDataChange?: (data: { resume: any; theme: any }) => void;
}

export default function CanvasEditor({ onDataChange }: CanvasEditorProps) {
  const stageRef = useRef<any>(null);

  const [resume, setResume] = useState({
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
    projects:
      "Resume Builder App — React, Node.js, MongoDB\nE-commerce MERN App — integrated Stripe & Redux\nChat App — real-time chat with Socket.IO",
    education:
      "B.E. in Computer Engineering\nThakur College of Engineering & Technology (2022–2024)\nCGPA: 8.5",
    contact:
      "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
  });

  const [theme, setTheme] = useState({
    primary: "#2563eb",
    fontFamily: "Poppins, sans-serif",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "elegant">(
    "modern"
  );

  // ✅ Memoized callback
  const handleDataChange = useCallback(() => {
    if (onDataChange) onDataChange({ resume, theme });
  }, [onDataChange, resume, theme]);

  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  const handleEdit = (
    field: string,
    value: string,
    e: KonvaEventObject<MouseEvent>
  ) => {
    const stage = stageRef.current.getStage();
    const absPos = e.target.getAbsolutePosition();
    const container = stage.container();

    const areaPosition = {
      x: absPos.x + container.offsetLeft,
      y: absPos.y + container.offsetTop,
    };

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = value;
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y - 6}px`;
    textarea.style.left = `${areaPosition.x - 6}px`;
    textarea.style.fontSize = "16px";
    textarea.style.zIndex = "1000";
    textarea.style.width = "420px";
    textarea.style.minHeight = "32px";
    textarea.style.padding = "10px 14px";
    textarea.style.border = "1.8px solid #2563eb";
    textarea.style.borderRadius = "8px";
    textarea.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.15)";
    textarea.style.background = "#f9fafb";
    textarea.style.fontFamily = theme.fontFamily;
    textarea.style.color = "#1f2937";
    textarea.style.resize = "none";
    textarea.focus();

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    autoResize();
    textarea.addEventListener("input", autoResize);

    let saved = false;

    const save = () => {
      if (saved) return;
      saved = true;

      setResume((prev) => {
        const prevValue = prev[field as keyof typeof prev];
        if (Array.isArray(prevValue) || typeof prevValue === "object") {
          console.warn(`Skipping edit: '${field}' is not a string`);
          return prev;
        }
        return { ...prev, [field]: textarea.value };
      });

      requestAnimationFrame(() => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
      });
    };

    textarea.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
      }
    });

    textarea.addEventListener("blur", save);
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      {/* 🎨 Template + Theme Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm border w-full justify-center">
        {/* Template Switcher */}
        <div className="flex gap-3 items-center">
          <span className="text-gray-700 font-medium mr-2">Template:</span>
          <button
            onClick={() => setSelectedTemplate("modern")}
            className={`px-3 py-1 rounded-md border text-sm font-medium transition ${
              selectedTemplate === "modern"
                ? "bg-blue-100 border-blue-400 text-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            Modern
          </button>
          <button
            onClick={() => setSelectedTemplate("elegant")}
            className={`px-3 py-1 rounded-md border text-sm font-medium transition ${
              selectedTemplate === "elegant"
                ? "bg-blue-100 border-blue-400 text-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            Elegant
          </button>
        </div>

        {/* 🎨 Color Picker */}
        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Primary Color:</label>
          <input
            type="color"
            value={theme.primary}
            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
            className="w-10 h-10 cursor-pointer border-2 border-gray-300 rounded-full shadow-sm"
          />
        </div>

        {/* 🖋️ Font Selector */}
        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Font:</label>
          <select
            value={theme.fontFamily}
            onChange={(e) =>
              setTheme({ ...theme, fontFamily: e.target.value })
            }
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

      {/* 🧾 Canvas Display */}
      <div className="bg-white border shadow-md p-4 rounded-md">
        {/* @ts-ignore */}
        <Stage width={800} height={1120} ref={stageRef}>
          {selectedTemplate === "modern" ? (
            <ModernTemplate
              {...{
                ...resume,
                experience: resume.experience
                  .map(
                    (exp) =>
                      `${exp.title} - ${exp.company} (${exp.period})\n${exp.location}\n${exp.description}`
                  )
                  .join("\n\n"),
                skills: resume.skills
                  .map((s) => `${s.name} (${s.level})`)
                  .join(", "),
              }}
              theme={theme}
              onEdit={handleEdit}
            />
          ) : (
            <ElegantTemplate
              {...{
                ...resume,
                experience: resume.experience
                  .map(
                    (exp) =>
                      `${exp.title} - ${exp.company} (${exp.period})\n${exp.location}\n${exp.description}`
                  )
                  .join("\n\n"),
                skills: resume.skills
                  .map((s) => `${s.name} (${s.level})`)
                  .join(", "),
              }}
              theme={theme}
              onEdit={handleEdit}
            />
          )}
        </Stage>
      </div>

      {/* 🧠 Editable Experience Section */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Experience</h2>
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
          + Entry
        </button>
      </div>
    </div>
  );
}
