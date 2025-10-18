import React, { useRef, useState } from "react";
import { Stage } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import ModernTemplate from "../temp/ModernTemplate";
import ElegantTemplate from "../temp/ElegantTemplate";

export default function CanvasEditor() {
  const stageRef = useRef<any>(null);

  // full editable resume data
  const [resume, setResume] = useState({
    name: "Arnav Singh",
    designation: "Frontend Developer",
    summary:
      "Passionate frontend developer skilled in React, TypeScript, and UI design. Experienced in building responsive, interactive applications.",
    experience:
      "Frontend Developer - Coding Community (2024–Present)\n• Built scalable UI with React and Tailwind CSS\n• Integrated real-time APIs with Socket.IO\n• Led responsive design initiatives",
    projects:
      "Resume Builder App — React, Node.js, MongoDB\nE-commerce MERN App — integrated Stripe & Redux\nChat App — real-time chat with Socket.IO",
    skills:
      "React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Redux Toolkit, Socket.IO",
    education:
      "B.E. in Computer Engineering\nThakur College of Engineering & Technology (2022–2024)\nCGPA: 8.5",
    contact:
      "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
  });

  const [theme, setTheme] = useState({
    primary: "#2563eb",
    fontFamily: "Poppins, sans-serif",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "elegant">("modern");

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
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.fontSize = "16px";
    textarea.style.zIndex = "1000";
    textarea.style.width = "400px";
    textarea.style.fontFamily = theme.fontFamily;
    textarea.style.lineHeight = "1.5";
    textarea.focus();

    let saved = false;

    const save = () => {
      if (saved) return;
      saved = true;

      setResume((prev) => ({ ...prev, [field]: textarea.value }));

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
    <div className="flex flex-col items-center gap-6 mt-8">
      {/* 🎨 Theme Controls */}
      <div className="flex gap-4 items-center flex-wrap justify-center">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          Primary Color:
          <input
            type="color"
            value={theme.primary}
            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
            className="w-10 h-10 p-0 border rounded-full"
          />
        </label>

        <div className="flex gap-2">
          {["Poppins", "Georgia", "Courier New"].map((font) => (
            <button
              key={font}
              onClick={() => setTheme({ ...theme, fontFamily: font })}
              className={`px-3 py-1 rounded border ${
                theme.fontFamily.includes(font)
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white"
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* 🧩 Template Switcher */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => setSelectedTemplate("modern")}
          className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
            selectedTemplate === "modern"
              ? "bg-blue-100 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Modern Template
        </button>

        <button
          onClick={() => setSelectedTemplate("elegant")}
          className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
            selectedTemplate === "elegant"
              ? "bg-blue-100 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          Elegant Template
        </button>
      </div>

      {/* 🧾 Canvas */}
      <div className="bg-white border shadow-md p-4 rounded-md mt-4">
        {/* @ts-ignore */}
        <Stage width={800} height={1120} ref={stageRef}>
          {selectedTemplate === "modern" ? (
            <ModernTemplate {...resume} theme={theme} onEdit={handleEdit} />
          ) : (
            <ElegantTemplate {...resume} theme={theme} onEdit={handleEdit} />
          )}
        </Stage>
      </div>
    </div>
  );
}
