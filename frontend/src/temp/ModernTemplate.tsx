import React, { useMemo } from "react";
import { Layer, Rect, Text, Line } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

interface TemplateProps {
  name: string;
  designation: string;
  summary: string;
  experience: string;
  projects: string;
  skills: string;
  education: string;
  contact: string;
  theme: { primary: string; fontFamily: string };
  onEdit: (field: string, value: string, e: KonvaEventObject<MouseEvent>) => void;
}

// Helper to measure text height dynamically
const getTextHeight = (text: string, fontSize: number, width: number) => {
  const lines = text.split("\n");
  const avgLineHeight = fontSize * 1.4;
  let totalLines = 0;

  lines.forEach((line) => {
    const charsPerLine = Math.floor(width / (fontSize * 0.6));
    totalLines += Math.ceil(line.length / charsPerLine);
  });

  return totalLines * avgLineHeight;
};

export default function ModernTemplate({
  name,
  designation,
  summary,
  experience,
  projects,
  skills,
  education,
  contact,
  theme,
  onEdit,
}: TemplateProps) {
  // dynamically calculate heights for reflow
  const layout = useMemo(() => {
    const summaryHeight = getTextHeight(summary, 14, 500);
    const expHeight = getTextHeight(experience, 14, 500);
    const projHeight = getTextHeight(projects, 14, 500);
    const skillsHeight = getTextHeight(skills, 14, 500);
    const eduHeight = getTextHeight(education, 14, 500);

    return {
      summaryHeight,
      expHeight,
      projHeight,
      skillsHeight,
      eduHeight,
    };
  }, [summary, experience, projects, skills, education]);

  // Starting Y positions that adjust dynamically
  const startY = {
    summary: 190,
    experience: 190 + layout.summaryHeight + 40,
    projects: 190 + layout.summaryHeight + layout.expHeight + 100,
    skills: 190 + layout.summaryHeight + layout.expHeight + layout.projHeight + 160,
    education:
      190 + layout.summaryHeight + layout.expHeight + layout.projHeight + layout.skillsHeight + 240,
  };

  return (
    <Layer>
      {/* Header */}
      <Rect x={0} y={0} width={800} height={120} fill={theme.primary} opacity={0.1} />
      <Text
        text={name}
        x={50}
        y={35}
        fontSize={38}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />
      <Text
        text={designation}
        x={50}
        y={85}
        fontSize={20}
        fontFamily={theme.fontFamily}
        fill="#333"
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("designation", designation, e)}
      />

      <Line points={[0, 130, 800, 130]} stroke={theme.primary} strokeWidth={1.5} opacity={0.4} />

      {/* === PROFILE SUMMARY === */}
      <Text
        text="PROFILE SUMMARY"
        x={50}
        y={150}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect x={50} y={175} width={60} height={2} fill={theme.primary} opacity={0.7} />
      <Text
        text={summary}
        x={50}
        y={190}
        width={500}
        fontSize={14}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("summary", summary, e)}
      />

      {/* === EXPERIENCE === */}
      <Text
        text="EXPERIENCE"
        x={50}
        y={startY.experience - 20}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect x={50} y={startY.experience + 5} width={60} height={2} fill={theme.primary} opacity={0.7} />
      <Text
        text={experience}
        x={50}
        y={startY.experience + 20}
        width={500}
        fontSize={14}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("experience", experience, e)}
      />

      {/* === PROJECTS === */}
      <Text
        text="PROJECTS"
        x={50}
        y={startY.projects - 20}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect x={50} y={startY.projects + 5} width={60} height={2} fill={theme.primary} opacity={0.7} />
      <Text
        text={projects}
        x={50}
        y={startY.projects + 20}
        width={500}
        fontSize={14}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("projects", projects, e)}
      />

      {/* === SKILLS === */}
      <Text
        text="SKILLS"
        x={50}
        y={startY.skills - 20}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect x={50} y={startY.skills + 5} width={60} height={2} fill={theme.primary} opacity={0.7} />
      <Text
        text={skills}
        x={50}
        y={startY.skills + 20}
        width={500}
        fontSize={14}
        fill="#444"
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("skills", skills, e)}
      />

      {/* === EDUCATION === */}
      <Text
        text="EDUCATION"
        x={50}
        y={startY.education - 20}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect
        x={50}
        y={startY.education + 5}
        width={60}
        height={2}
        fill={theme.primary}
        opacity={0.7}
      />
      <Text
        text={education}
        x={50}
        y={startY.education + 20}
        width={500}
        fontSize={14}
        fill="#444"
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("education", education, e)}
      />

      {/* === CONTACT === */}
      <Text
        text="CONTACT"
        x={600}
        y={150}
        fontSize={18}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
      />
      <Rect x={600} y={175} width={60} height={2} fill={theme.primary} opacity={0.7} />
      <Text
        text={contact}
        x={600}
        y={190}
        width={180}
        fontSize={13}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("contact", contact, e)}
      />
    </Layer>
  );
}
