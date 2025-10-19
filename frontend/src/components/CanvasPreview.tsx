import React, { useEffect, useState } from "react";
import { Stage } from "react-konva";
import type { Stage as StageType } from "konva/lib/Stage";
import ModernTemplate from "../temp/ModernTemplate";
import ElegantTemplate from "../temp/ElegantTemplate";

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

interface CanvasPreviewProps {
  stageRef: React.RefObject<StageType>;
  resume: ResumeData;
  theme: Theme;
  selectedTemplate: "modern" | "elegant";
  onEdit: (field: string, value: string, e: any) => void;
}

export default function CanvasPreview({
  stageRef,
  resume,
  theme,
  selectedTemplate,
  onEdit,
}: CanvasPreviewProps) {
  const [scale, setScale] = useState(1);

  // ✅ Responsive scaling
  useEffect(() => {
    const resize = () => {
      const containerWidth = Math.min(window.innerWidth - 40, 800);
      setScale(containerWidth / 800);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ✅ Format text data for templates
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

  return (
    <div className="bg-white border shadow-md p-4 rounded-md w-full flex justify-center">
      {/* @ts-expect-error Konva Stage type missing children prop */}
      <Stage
        width={800}
        height={1120}
        scaleX={scale}
        scaleY={scale}
        ref={stageRef}
      >
        {selectedTemplate === "modern" ? (
          <ModernTemplate
            name={resume.name}
            designation={resume.designation}
            summary={resume.summary}
            experience={formattedExperience}
            projects={resume.projects}
            skills={formattedSkills}
            education={resume.education}
            contact={resume.contact}
            theme={theme}
            onEdit={onEdit}
          />
        ) : (
          <ElegantTemplate
            name={resume.name}
            designation={resume.designation}
            summary={resume.summary}
            experience={formattedExperience}
            projects={resume.projects}
            skills={formattedSkills}
            education={resume.education}
            contact={resume.contact}
            theme={theme}
            onEdit={onEdit}
          />
        )}
      </Stage>
    </div>
  );
}
