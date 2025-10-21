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
  theme: {
    primary: string;
    fontFamily: string;
    fontSize?: number;
    lineHeight?: number;
    pageMargin?: number;
    sectionSpacing?: number;
  };
  onEdit: (field: string, value: string, e: KonvaEventObject<MouseEvent>) => void;
  scale?: number;
  isMobile?: boolean;
  compactMode?: boolean;
  canvasWidth?: number;
  sectionOrder?: string[];
}

const getTextHeight = (
  text: string,
  fontSize: number,
  width: number,
  lineHeight: number
) => {
  if (!text || text.trim().length === 0) return 0;
  const lines = text.split("\n");
  const avgLineHeight = fontSize * lineHeight;
  let totalLines = 0;
  lines.forEach((line) => {
    const charsPerLine = Math.floor(width / (fontSize * 0.55));
    totalLines += Math.max(1, Math.ceil(line.length / charsPerLine));
  });
  return totalLines * avgLineHeight + 10;
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
  canvasWidth = 600,
  sectionOrder = ["summary", "experience", "projects", "skills", "education", "contact"],
}: TemplateProps) {
  const responsive = useMemo(() => {
    const scaleFactor = canvasWidth / 800;
    const fontSizeSetting = theme.fontSize ?? 3;
    const fontScaleMap = { 1: 0.85, 2: 0.95, 3: 1, 4: 1.1, 5: 1.2 } as const;
    const fontScale =
      fontScaleMap[(Math.min(5, Math.max(1, fontSizeSetting)) as 1 | 2 | 3 | 4 | 5)] || 1;

    const marginSetting = theme.pageMargin ?? 4;
    const marginScale = 0.6 + ((Math.min(8, Math.max(1, marginSetting)) - 1) / 7) * 1.2;
    const padding = 50 * scaleFactor * marginScale;

    const spacingSetting = theme.sectionSpacing ?? 2;
    const spacingScale = 0.7 + ((Math.min(8, Math.max(1, spacingSetting)) - 1) / 7) * 1.2;

    return {
      padding,
      fontSize: {
        name: Math.max(34, 38 * scaleFactor) * fontScale,
        designation: Math.max(16, 20 * scaleFactor) * fontScale,
        section: Math.max(14, 18 * scaleFactor) * fontScale,
        body: Math.max(12, 14 * scaleFactor) * fontScale,
        contact: Math.max(11, 13 * scaleFactor) * fontScale,
      },
      lineHeight: {
        name: 1.2,
        designation: 1.3,
        body: theme.lineHeight ?? 1.6,
      },
      gaps: {
        headerGap: 50 * scaleFactor * spacingScale,
        sectionGap: 50 * spacingScale,
        contentGap: 15 * scaleFactor,
        blockGap: 30 * spacingScale,
      },
    };
  }, [canvasWidth, theme.fontSize, theme.pageMargin, theme.sectionSpacing, theme.lineHeight]);

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
    const experienceBlocks = String(experience)
      .split("\n\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    return {
      experienceBlocks,
      leftWidth: 500 * (canvasWidth / 800),
      rightWidth: 180 * (canvasWidth / 800),
    };
  }, [experience, canvasWidth]);

  const positions = useMemo(() => {
    const positions: { [key: string]: number } = {};

    // Header height
    const headerHeight =
      responsive.padding +
      responsive.fontSize.name +
      responsive.fontSize.designation +
      40 +
      20;

    // Initial Y positions for left and right columns
    let leftY = headerHeight + responsive.gaps.headerGap;
    let rightY = headerHeight + responsive.gaps.headerGap;

    for (const section of sectionOrder) {
      const content = sectionContent[section as keyof typeof sectionContent];
      if (!content || !content.content || content.content.trim() === "") continue;

      if (content.type === "left") {
        positions[section] = leftY;

        let sectionHeight = responsive.fontSize.section + responsive.gaps.contentGap;

        if (section === "experience") {
          sectionHeight += layout.experienceBlocks.reduce((sum, block) => {
            return (
              sum +
              getTextHeight(
                block,
                responsive.fontSize.body,
                layout.leftWidth,
                responsive.lineHeight.body
              ) +
              responsive.gaps.blockGap
            );
          }, 0);
        } else {
          sectionHeight += getTextHeight(
            content.content,
            responsive.fontSize.body,
            layout.leftWidth,
            responsive.lineHeight.body
          );
        }

        leftY += sectionHeight + responsive.gaps.sectionGap;
      } else {
        positions[section] = rightY;

        let sectionHeight = responsive.fontSize.section + responsive.gaps.contentGap;

        if (section === "experience") {
          sectionHeight += layout.experienceBlocks.reduce((sum, block) => {
            return (
              sum +
              getTextHeight(
                block,
                responsive.fontSize.body,
                layout.rightWidth,
                responsive.lineHeight.body
              ) +
              responsive.gaps.blockGap
            );
          }, 0);
        } else {
          sectionHeight += getTextHeight(
            content.content,
            responsive.fontSize.body,
            layout.rightWidth,
            responsive.lineHeight.body
          );
        }

        rightY += sectionHeight + responsive.gaps.sectionGap;
      }
    }

    return positions;
  }, [responsive, layout, sectionOrder, sectionContent, experience]);

  const renderSection = (sectionKey: string) => {
    const content = sectionContent[sectionKey as keyof typeof sectionContent];
    if (!content || !positions[sectionKey]) return null;

    const y = positions[sectionKey];
    const x = content.type === "left" ? responsive.padding : 600 * (canvasWidth / 800);
    const width = content.type === "left" ? layout.leftWidth : layout.rightWidth;

    return (
      <React.Fragment key={sectionKey}>
        {/* Section Title */}
        <Text
          text={content.title}
          x={x}
          y={y}
          fontSize={responsive.fontSize.section}
          fontStyle="bold"
          fill={theme.primary}
          fontFamily={theme.fontFamily}
        />

        {/* Underline */}
        <Rect
          x={x}
          y={y + responsive.fontSize.section + 5}
          width={60}
          height={2}
          fill={theme.primary}
          opacity={0.7}
        />

        {/* Content */}
        {sectionKey === "experience" ? (
          (() => {
            let contentY = y + responsive.fontSize.section + responsive.gaps.contentGap + 10;
            return layout.experienceBlocks.map((block, i) => {
              const blockHeight = getTextHeight(
                block,
                responsive.fontSize.body,
                width,
                responsive.lineHeight.body
              );
              const node = (
                <Text
                  key={`${sectionKey}-${i}`}
                  text={block}
                  x={x}
                  y={contentY}
                  width={width}
                  fontSize={responsive.fontSize.body}
                  fill="#444"
                  lineHeight={responsive.lineHeight.body}
                  fontFamily={theme.fontFamily}
                  onClick={(e: KonvaEventObject<MouseEvent>) =>
                    onEdit(sectionKey, content.content, e)
                  }
                />
              );
              contentY += blockHeight + responsive.gaps.blockGap;
              return node;
            });
          })()
        ) : (
          <Text
            text={content.content}
            x={x}
            y={y + responsive.fontSize.section + responsive.gaps.contentGap + 10}
            width={width}
            fontSize={responsive.fontSize.body}
            fill="#444"
            lineHeight={responsive.lineHeight.body}
            fontFamily={theme.fontFamily}
            onClick={(e: KonvaEventObject<MouseEvent>) =>
              onEdit(sectionKey, content.content, e)
            }
          />
        )}
      </React.Fragment>
    );
  };

  const headerBgHeight =
    responsive.padding +
    responsive.fontSize.name +
    responsive.fontSize.designation +
    40;

  return (
    <Layer>
      {/* === HEADER === */}
      <Rect
        x={0}
        y={0}
        width={canvasWidth}
        height={headerBgHeight}
        fill={theme.primary}
        opacity={0.1}
      />
      
      <Text
        text={name.toUpperCase()}
        x={responsive.padding}
        y={responsive.padding}
        fontSize={responsive.fontSize.name}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />
      
      <Text
        text={designation}
        x={responsive.padding}
        y={responsive.padding + responsive.fontSize.name + 10}
        fontSize={responsive.fontSize.designation}
        fontFamily={theme.fontFamily}
        fill="#333"
        onClick={(e: KonvaEventObject<MouseEvent>) =>
          onEdit("designation", designation, e)
        }
      />

      <Line
        points={[0, headerBgHeight, canvasWidth, headerBgHeight]}
        stroke={theme.primary}
        strokeWidth={1.5}
        opacity={0.4}
      />

      {/* RENDER SECTIONS IN ORDER */}
      {sectionOrder.map((section) => renderSection(section))}
    </Layer>
  );
}