import React, { useMemo } from "react";
import { Layer, Rect, Text } from "react-konva";
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
  theme: { primary: string; fontFamily: string; fontSize?: number; lineHeight?: number; pageMargin?: number; sectionSpacing?: number };
  onEdit: (field: string, value: string, e: KonvaEventObject<MouseEvent>) => void;
  scale?: number;
  isMobile?: boolean;
  compactMode?: boolean;
  canvasWidth?: number;
  sectionOrder?: string[];
}

const getTextHeight = (text: string, fontSize: number, width: number, lineHeight: number) => {
  if (!text || text.trim().length === 0) return 0;
  const lines = text.split("\n");
  const avgLineHeight = fontSize * lineHeight;
  let totalLines = 0;

  lines.forEach((line) => {
    const charsPerLine = Math.floor(width / (fontSize * 0.55));
    totalLines += Math.max(1, Math.ceil(line.length / charsPerLine));
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
  scale = 1,
  isMobile = false,
  compactMode = false,
  canvasWidth = 600,
  sectionOrder = ["summary", "experience", "projects", "skills", "education", "contact"],
}: TemplateProps) {
  const responsive = useMemo(() => {
    const scaleFactor = canvasWidth / 800;
    const fontSizeSetting = theme.fontSize ?? 3; // 1..5
    const fontScaleMap = { 1: 0.85, 2: 0.95, 3: 1, 4: 1.1, 5: 1.2 } as const;
    const fontScale = fontScaleMap[(Math.min(5, Math.max(1, fontSizeSetting)) as 1|2|3|4|5)] || 1;

    const basePadding = 45 * scaleFactor;
    const marginSetting = theme.pageMargin ?? 4; // 1..8
    const marginScale = 0.6 + ((Math.min(8, Math.max(1, marginSetting)) - 1) / 7) * 1.2; // ~0.6..1.8
    const padding = basePadding * marginScale;

    const baseSectionSpacing = 45 * scaleFactor;
    const spacingSetting = theme.sectionSpacing ?? 2; // 1..8
    const spacingScale = 0.7 + ((Math.min(8, Math.max(1, spacingSetting)) - 1) / 7) * 1.2; // ~0.7..1.9

    return {
      padding,
      headerHeight: 160 * scaleFactor,
      fontSize: {
        title: Math.max(26, 40 * scaleFactor) * fontScale,
        subtitle: Math.max(16, 20 * scaleFactor) * fontScale,
        section: Math.max(13, 15 * scaleFactor) * fontScale,
        body: Math.max(11, 13 * scaleFactor) * fontScale,
        small: Math.max(10, 12 * scaleFactor) * fontScale,
      },
      lineHeight: {
        title: 1.1,
        subtitle: 1.3,
        body: theme.lineHeight ?? 1.6,
      },
      gaps: {
        sectionTitle: 18 * scaleFactor,
        sectionSpacing: baseSectionSpacing * spacingScale,
        blockSpacing: 22 * scaleFactor * spacingScale,
      },
    };
  }, [canvasWidth, compactMode, theme.fontSize, theme.pageMargin, theme.sectionSpacing, theme.lineHeight]);

  const sectionContent = useMemo(() => {
    return {
      summary: { title: "PROFILE SUMMARY", content: summary, type: "left" },
      experience: { title: "EXPERIENCE", content: experience, type: "left" },
      projects: { title: "PROJECTS", content: projects, type: "left" },
      skills: { title: "SKILLS", content: skills, type: "left" },
      education: { title: "EDUCATION", content: education, type: "right" },
      contact: { title: "CONTACT", content: contact, type: "right" },
    };
  }, [summary, experience, projects, skills, education, contact]);

  const layout = useMemo(() => {
    const fullWidth = canvasWidth - responsive.padding * 2;
    const leftColWidth = fullWidth * 0.65;
    const rightColWidth = fullWidth * 0.3;

    const experienceBlocks = String(experience)
      .split("\n\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    return {
      leftColWidth,
      rightColWidth,
      gapBetweenCols: fullWidth * 0.05,
      experienceBlocks,
    };
  }, [experience, responsive, canvasWidth]);

  const positions = useMemo(() => {
    const leftX = responsive.padding;
    const rightX = responsive.padding + layout.leftColWidth + layout.gapBetweenCols;
    const positions: { [key: string]: { title: number; content: number } } = {};

    let leftY = responsive.headerHeight + responsive.gaps.sectionSpacing;
    let rightY = responsive.headerHeight + responsive.gaps.sectionSpacing;

    for (const section of sectionOrder) {
      const content = sectionContent[section as keyof typeof sectionContent];
      if (!content) continue;

      const text = content.content;
      let height = 0;

      if (section === "experience") {
        height = layout.experienceBlocks.reduce((sum, block) => {
          return sum + getTextHeight(block, responsive.fontSize.body, layout.leftColWidth, responsive.lineHeight.body) + responsive.gaps.blockSpacing;
        }, 0);
      } else {
        const colWidth = content.type === "left" ? layout.leftColWidth : layout.rightColWidth;
        height = getTextHeight(text, responsive.fontSize.body, colWidth, responsive.lineHeight.body);
      }

      if (content.type === "left") {
        positions[section] = { title: leftY, content: leftY + responsive.gaps.sectionTitle };
        leftY += responsive.gaps.sectionTitle + height + responsive.gaps.sectionSpacing;
      } else {
        positions[section] = { title: rightY, content: rightY + responsive.gaps.sectionTitle };
        rightY += responsive.gaps.sectionTitle + height + responsive.gaps.sectionSpacing;
      }
    }

    return {
      leftX,
      rightX,
      sections: positions,
    };
  }, [responsive, layout, sectionOrder, sectionContent]);

  const renderSection = (sectionKey: string) => {
    const content = sectionContent[sectionKey as keyof typeof sectionContent];
    if (!content || !positions.sections[sectionKey]) return null;

    const x = content.type === "left" ? positions.leftX : positions.rightX;
    const width = content.type === "left" ? layout.leftColWidth : layout.rightColWidth;
    const pos = positions.sections[sectionKey];
    const fieldName = sectionKey === "experience" ? "experience" : sectionKey;

    return (
      <React.Fragment key={sectionKey}>
        {/* Section Title */}
        <Text
          text={content.title}
          x={x}
          y={pos.title}
          fontSize={responsive.fontSize.section}
          fontStyle="bold"
          fill={theme.primary}
          fontFamily={theme.fontFamily}
          letterSpacing={1}
        />

        {/* Section Content */}
        {sectionKey === "experience" ? (
          (() => {
            let y = pos.content;
            return layout.experienceBlocks.map((block, i) => {
              const blockHeight = getTextHeight(block, responsive.fontSize.body, width, responsive.lineHeight.body);
              const node = (
                <Text
                  key={`${sectionKey}-${i}`}
                  text={block}
                  x={x}
                  y={y}
                  width={width}
                  fontSize={responsive.fontSize.body}
                  fill="#444"
                  lineHeight={responsive.lineHeight.body}
                  fontFamily={theme.fontFamily}
                  onClick={(e: KonvaEventObject<MouseEvent>) => onEdit(fieldName, content.content, e)}
                />
              );
              y += blockHeight + responsive.gaps.blockSpacing;
              return node;
            });
          })()
        ) : (
          <Text
            text={content.content}
            x={x}
            y={pos.content}
            width={width}
            fontSize={responsive.fontSize.body}
            fill="#444"
            lineHeight={responsive.lineHeight.body}
            fontFamily={theme.fontFamily}
            onClick={(e: KonvaEventObject<MouseEvent>) => onEdit(fieldName, content.content, e)}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <Layer>
      {/* HEADER BACKGROUND */}
      <Rect
        x={0}
        y={0}
        width={canvasWidth}
        height={responsive.headerHeight}
        fill={theme.primary}
        opacity={0.07}
      />

      {/* NAME */}
      <Text
        text={name.toUpperCase()}
        x={responsive.padding}
        y={responsive.padding + 20}
        fontSize={responsive.fontSize.title}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        lineHeight={responsive.lineHeight.title}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />

      {/* DESIGNATION */}
      <Text
        text={designation}
        x={responsive.padding}
        y={responsive.padding + responsive.fontSize.title + 40}
        fontSize={responsive.fontSize.subtitle}
        fontFamily={theme.fontFamily}
        fill="#666"
        lineHeight={responsive.lineHeight.subtitle}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("designation", designation, e)}
      />

      {/* RENDER SECTIONS IN ORDER */}
      {sectionOrder.map((section) => renderSection(section))}
    </Layer>
  );
}