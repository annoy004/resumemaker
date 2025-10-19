import React, { useMemo } from "react";
import { Layer, Rect, Text, Line, Circle } from "react-konva";
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
  const avgLineHeight = fontSize * 1.5; // Increased line height
  let totalLines = 0;

  lines.forEach((line) => {
    const charsPerLine = Math.floor(width / (fontSize * 0.55)); // More accurate char width
    totalLines += Math.max(1, Math.ceil(line.length / charsPerLine));
  });

  return totalLines * avgLineHeight + 10; // Added padding
};

export default function ElegantTemplate({
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
  // Dynamically calculate heights for reflow
  const layout = useMemo(() => {
    const summaryHeight = getTextHeight(summary, 13, 680);
    const expHeight = getTextHeight(experience, 13, 320);
    const projHeight = getTextHeight(projects, 13, 320);
    const skillsHeight = getTextHeight(skills, 13, 280);
    const eduHeight = getTextHeight(education, 13, 280);

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
    summary: 260,
    experience: 260 + layout.summaryHeight + 60,
    projects: 260 + layout.summaryHeight + layout.expHeight + 120,
    skills: 260 + layout.summaryHeight + layout.expHeight + 60,
    education: 260 + layout.summaryHeight + layout.expHeight + layout.skillsHeight + 120,
  };

  return (
    <Layer>
      {/* Elegant decorative top border */}
      <Rect x={0} y={0} width={800} height={4} fill={theme.primary} opacity={0.8} />
      
      {/* Subtle side accents */}
      <Rect x={0} y={0} width={2} height={1200} fill={theme.primary} opacity={0.15} />
      <Rect x={798} y={0} width={2} height={1200} fill={theme.primary} opacity={0.15} />

      {/* Decorative circles - elegant corner elements */}
      <Circle x={60} y={60} radius={100} fill={theme.primary} opacity={0.03} />
      <Circle x={740} y={60} radius={80} fill={theme.primary} opacity={0.04} />

      {/* Centered Header Section */}
      <Text
        text={name}
        x={0}
        y={80}
        width={800}
        align="center"
        fontSize={42}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        letterSpacing={2}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />

      {/* Elegant divider line under name */}
      <Line 
        points={[320, 135, 480, 135]} 
        stroke={theme.primary} 
        strokeWidth={2} 
        opacity={0.6}
      />
      <Circle x={320} y={135} radius={3} fill={theme.primary} opacity={0.8} />
      <Circle x={480} y={135} radius={3} fill={theme.primary} opacity={0.8} />

      <Text
        text={designation}
        x={0}
        y={150}
        width={800}
        align="center"
        fontSize={20}
        fontFamily={theme.fontFamily}
        fill="#555"
        letterSpacing={3}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("designation", designation, e)}
      />

      {/* Contact Info - Elegant top placement */}
      <Rect x={250} y={190} width={300} height={1} fill={theme.primary} opacity={0.2} />
      <Text
        text={contact}
        x={0}
        y={200}
        width={800}
        align="center"
        fontSize={11}
        fill="#666"
        lineHeight={1.5}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("contact", contact, e)}
      />

      {/* === PROFILE SUMMARY (Centered, Full Width) === */}
      <Rect x={60} y={startY.summary - 30} width={680} height={1} fill={theme.primary} opacity={0.3} />
      <Text
        text="PROFILE SUMMARY"
        x={0}
        y={startY.summary - 20}
        width={800}
        align="center"
        fontSize={14}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
        letterSpacing={2}
      />
      <Text
        text={summary}
        x={60}
        y={startY.summary}
        width={680}
        align="center"
        fontSize={13}
        fill="#444"
        lineHeight={1.7}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("summary", summary, e)}
      />

      {/* === TWO COLUMN LAYOUT === */}
      {/* Left Column Background */}
      <Rect 
        x={50} 
        y={startY.experience - 50} 
        width={360} 
        height={layout.expHeight + layout.projHeight + 120} 
        fill={theme.primary} 
        opacity={0.02} 
        cornerRadius={8}
      />

      {/* === EXPERIENCE (Left Column) === */}
      <Text
        text="EXPERIENCE"
        x={70}
        y={startY.experience - 30}
        fontSize={16}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
        letterSpacing={1.5}
      />
      <Rect x={70} y={startY.experience - 5} width={50} height={2} fill={theme.primary} opacity={0.6} />
      <Text
        text={experience}
        x={70}
        y={startY.experience + 10}
        width={320}
        fontSize={13}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("experience", experience, e)}
      />

      {/* === PROJECTS (Left Column) === */}
      <Text
        text="PROJECTS"
        x={70}
        y={startY.projects - 30}
        fontSize={16}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
        letterSpacing={1.5}
      />
      <Rect x={70} y={startY.projects - 5} width={50} height={2} fill={theme.primary} opacity={0.6} />
      <Text
        text={projects}
        x={70}
        y={startY.projects + 10}
        width={320}
        fontSize={13}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("projects", projects, e)}
      />

      {/* Right Column Background */}
      <Rect 
        x={430} 
        y={startY.skills - 50} 
        width={320} 
        height={layout.skillsHeight + layout.eduHeight + 120} 
        fill={theme.primary} 
        opacity={0.02} 
        cornerRadius={8}
      />

      {/* === SKILLS (Right Column) === */}
      <Text
        text="SKILLS"
        x={450}
        y={startY.skills - 30}
        fontSize={16}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
        letterSpacing={1.5}
      />
      <Rect x={450} y={startY.skills - 5} width={50} height={2} fill={theme.primary} opacity={0.6} />
      <Text
        text={skills}
        x={450}
        y={startY.skills + 10}
        width={280}
        fontSize={13}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("skills", skills, e)}
      />

      {/* === EDUCATION (Right Column) === */}
      <Text
        text="EDUCATION"
        x={450}
        y={startY.education - 30}
        fontSize={16}
        fontStyle="bold"
        fill={theme.primary}
        fontFamily={theme.fontFamily}
        letterSpacing={1.5}
      />
      <Rect 
        x={450} 
        y={startY.education - 5} 
        width={50} 
        height={2} 
        fill={theme.primary} 
        opacity={0.6} 
      />
      <Text
        text={education}
        x={450}
        y={startY.education + 10}
        width={280}
        fontSize={13}
        fill="#444"
        lineHeight={1.6}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("education", education, e)}
      />

      {/* Elegant bottom accent */}
      <Rect 
        x={0} 
        y={Math.max(startY.projects + layout.projHeight, startY.education + layout.eduHeight) + 80} 
        width={800} 
        height={60} 
        fill={theme.primary} 
        opacity={0.08} 
      />
      <Text
        text="Designed with Elegance • Professional Resume"
        x={0}
        y={Math.max(startY.projects + layout.projHeight, startY.education + layout.eduHeight) + 102}
        width={800}
        align="center"
        fontSize={10}
        fill="#888"
        fontFamily={theme.fontFamily}
        letterSpacing={1}
      />
    </Layer>
  );
}