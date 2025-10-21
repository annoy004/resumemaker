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
    const charsPerLine = Math.floor(width / (fontSize * 0.52));
    totalLines += Math.max(1, Math.ceil(line.length / charsPerLine));
  });

  return totalLines * avgLineHeight + 15;
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
  scale = 1,
  isMobile = false,
  compactMode = false,
  canvasWidth = 600,
  sectionOrder = ["summary", "experience", "projects", "skills", "education", "contact"],
}: TemplateProps) {
  const responsive = useMemo(() => {
    const scaleFactor = canvasWidth / 800;
    const fontSizeSetting = theme.fontSize ?? 3;
    const fontScaleMap = { 1: 0.85, 2: 0.95, 3: 1, 4: 1.1, 5: 1.2 } as const;
    const fontScale =
      fontScaleMap[(Math.min(5, Math.max(1, fontSizeSetting)) as 1 | 2 | 3 | 4 | 5)] || 1;

    const basePadding = 50 * scaleFactor;
    const marginSetting = theme.pageMargin ?? 4;
    const marginScale = 0.6 + ((Math.min(8, Math.max(1, marginSetting)) - 1) / 7) * 1.2;
    const padding = basePadding * marginScale;

    const baseSectionSpacing = 50 * scaleFactor;
    const spacingSetting = theme.sectionSpacing ?? 2;
    const spacingScale = 0.7 + ((Math.min(8, Math.max(1, spacingSetting)) - 1) / 7) * 1.2;

    return {
      padding,
      fontSize: {
        name: Math.max(36, 40 * scaleFactor) * fontScale,
        designation: Math.max(14, 18 * scaleFactor) * fontScale,
        section: Math.max(12, 14 * scaleFactor) * fontScale,
        body: Math.max(11, 12 * scaleFactor) * fontScale,
        small: Math.max(9, 10 * scaleFactor) * fontScale,
        contact: Math.max(9, 10 * scaleFactor) * fontScale,
      },
      lineHeight: {
        name: 1.1,
        designation: 1.2,
        body: theme.lineHeight ?? 1.5,
      },
      gaps: {
        sectionTitle: 12 * scaleFactor,
        sectionSpacing: baseSectionSpacing * spacingScale,
        blockSpacing: 18 * scaleFactor * spacingScale,
      },
      columnWidths: {
        left: (canvasWidth - padding * 2) * 0.48,
        right: (canvasWidth - padding * 2) * 0.48,
        gap: (canvasWidth - padding * 2) * 0.04,
      },
    };
  }, [canvasWidth, theme.fontSize, theme.pageMargin, theme.sectionSpacing, theme.lineHeight]);

  const sectionContent = useMemo(() => {
    return {
      summary: { title: "PROFILE SUMMARY", content: summary, type: "center" },
      experience: { title: "EXPERIENCE", content: experience, type: "left" },
      projects: { title: "PROJECTS", content: projects, type: "left" },
      skills: { title: "SKILLS", content: skills, type: "right" },
      education: { title: "EDUCATION", content: education, type: "right" },
      contact: { title: "CONTACT", content: contact, type: "center" },
    };
  }, [summary, experience, projects, skills, education, contact]);

  const layout = useMemo(() => {
    const experienceBlocks = String(experience)
      .split("\n\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    return {
      experienceBlocks,
      leftColWidth: responsive.columnWidths.left,
      rightColWidth: responsive.columnWidths.right,
    };
  }, [experience, responsive]);

  const positions = useMemo(() => {
    const centerX = canvasWidth / 2;
    const leftX = responsive.padding;
    const rightX = responsive.padding + layout.leftColWidth + responsive.columnWidths.gap;

    const positions: { [key: string]: { title: number; content: number } } = {};

    let leftY = 240;
    let rightY = 240;
    let centerY = 220;

    for (const section of sectionOrder) {
      const content = sectionContent[section as keyof typeof sectionContent];
      if (!content) continue;

      const text = content.content;
      let height = 0;

      if (section === "experience") {
        height = layout.experienceBlocks.reduce((sum, block) => {
          return (
            sum +
            getTextHeight(
              block,
              responsive.fontSize.body,
              layout.leftColWidth,
              responsive.lineHeight.body
            ) +
            responsive.gaps.blockSpacing
          );
        }, 0);
      } else {
        const colWidth =
          content.type === "left"
            ? layout.leftColWidth
            : content.type === "right"
            ? layout.rightColWidth
            : canvasWidth - responsive.padding * 2;
        height = getTextHeight(
          text,
          responsive.fontSize.body,
          colWidth,
          responsive.lineHeight.body
        );
      }

      if (content.type === "center") {
        positions[section] = { title: centerY, content: centerY + responsive.gaps.sectionTitle };
        centerY += responsive.gaps.sectionTitle + height + responsive.gaps.sectionSpacing;
      } else if (content.type === "left") {
        positions[section] = { title: leftY, content: leftY + responsive.gaps.sectionTitle };
        leftY += responsive.gaps.sectionTitle + height + responsive.gaps.sectionSpacing;
      } else {
        positions[section] = { title: rightY, content: rightY + responsive.gaps.sectionTitle };
        rightY += responsive.gaps.sectionTitle + height + responsive.gaps.sectionSpacing;
      }
    }

    return {
      centerX,
      leftX,
      rightX,
      sections: positions,
    };
  }, [responsive, layout, sectionOrder, sectionContent, canvasWidth]);

  const renderSection = (sectionKey: string) => {
    const content = sectionContent[sectionKey as keyof typeof sectionContent];
    if (!content || !positions.sections[sectionKey]) return null;

    const pos = positions.sections[sectionKey];
    let x: number;
    let width: number;
    let align: "left" | "center" | "right" = "left";

    if (content.type === "center") {
      x = 0;
      width = canvasWidth;
      align = "center";
    } else if (content.type === "left") {
      x = positions.leftX;
      width = layout.leftColWidth;
    } else {
      x = positions.rightX;
      width = layout.rightColWidth;
    }

    return (
      <React.Fragment key={sectionKey}>
        {/* Section Title */}
        <Text
          text={content.title}
          x={x}
          y={pos.title}
          width={width}
          align={align}
          fontSize={responsive.fontSize.section}
          fontStyle="bold"
          fill={theme.primary}
          fontFamily={theme.fontFamily}
          letterSpacing={1.5}
        />

        {/* Elegant Title Underline */}
        <Line
          points={[
            content.type === "center" ? canvasWidth / 2 - 30 : x,
            pos.title + responsive.fontSize.section + 6,
            content.type === "center" ? canvasWidth / 2 + 30 : x + 60,
            pos.title + responsive.fontSize.section + 6,
          ]}
          stroke={theme.primary}
          strokeWidth={1.5}
          opacity={0.7}
        />
        <Circle
          x={content.type === "center" ? canvasWidth / 2 - 30 : x}
          y={pos.title + responsive.fontSize.section + 6}
          radius={2}
          fill={theme.primary}
          opacity={0.8}
        />
        <Circle
          x={content.type === "center" ? canvasWidth / 2 + 30 : x + 60}
          y={pos.title + responsive.fontSize.section + 6}
          radius={2}
          fill={theme.primary}
          opacity={0.8}
        />

        {/* Section Content */}
        {sectionKey === "experience" ? (
          (() => {
            let y = pos.content;
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
                  y={y}
                  width={width}
                  align={align}
                  fontSize={responsive.fontSize.body}
                  fill="#444"
                  lineHeight={responsive.lineHeight.body}
                  fontFamily={theme.fontFamily}
                  onClick={(e: KonvaEventObject<MouseEvent>) =>
                    onEdit(sectionKey, content.content, e)
                  }
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
            align={align}
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

  const headerY = 70;

  return (
    <Layer>
      {/* Elegant decorative top border */}
      <Rect x={0} y={0} width={canvasWidth} height={3} fill={theme.primary} opacity={0.9} />

      {/* Subtle side accents */}
      <Rect x={0} y={0} width={1.5} height={canvasWidth * 1.5} fill={theme.primary} opacity={0.12} />
      <Rect
        x={canvasWidth - 1.5}
        y={0}
        width={1.5}
        height={canvasWidth * 1.5}
        fill={theme.primary}
        opacity={0.12}
      />

      {/* Decorative circles - more subtle */}
      <Circle
        x={responsive.padding * 1.5}
        y={responsive.padding * 1.5}
        radius={60 * (canvasWidth / 800)}
        fill={theme.primary}
        opacity={0.02}
      />
      <Circle
        x={canvasWidth - responsive.padding * 1.5}
        y={responsive.padding * 1.5}
        radius={45 * (canvasWidth / 800)}
        fill={theme.primary}
        opacity={0.03}
      />

      {/* CENTERED HEADER SECTION */}
      <Text
        text={name.toUpperCase()}
        x={0}
        y={headerY}
        width={canvasWidth}
        align="center"
        fontSize={responsive.fontSize.name}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        letterSpacing={1.8}
        lineHeight={responsive.lineHeight.name}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />

      {/* Elegant divider line under name */}
      <Line
        points={[
          canvasWidth / 2 - 50,
          headerY + responsive.fontSize.name + 12,
          canvasWidth / 2 + 50,
          headerY + responsive.fontSize.name + 12,
        ]}
        stroke={theme.primary}
        strokeWidth={1.8}
        opacity={0.7}
      />
      <Circle
        x={canvasWidth / 2 - 50}
        y={headerY + responsive.fontSize.name + 12}
        radius={2.5}
        fill={theme.primary}
        opacity={0.9}
      />
      <Circle
        x={canvasWidth / 2 + 50}
        y={headerY + responsive.fontSize.name + 12}
        radius={2.5}
        fill={theme.primary}
        opacity={0.9}
      />

      {/* DESIGNATION */}
      <Text
        text={designation}
        x={0}
        y={headerY + responsive.fontSize.name + 30}
        width={canvasWidth}
        align="center"
        fontSize={responsive.fontSize.designation}
        fontFamily={theme.fontFamily}
        fill="#555"
        letterSpacing={1.5}
        lineHeight={responsive.lineHeight.designation}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("designation", designation, e)}
      />

      {/* CONTACT INFO */}
      <Rect
        x={responsive.padding + 40}
        y={headerY + responsive.fontSize.name + responsive.fontSize.designation + 50}
        width={canvasWidth - responsive.padding * 2 - 80}
        height={0.8}
        fill={theme.primary}
        opacity={0.15}
      />
      <Text
        text={contact}
        x={0}
        y={headerY + responsive.fontSize.name + responsive.fontSize.designation + 65}
        width={canvasWidth}
        align="center"
        fontSize={responsive.fontSize.contact}
        fill="#666"
        lineHeight={1.4}
        fontFamily={theme.fontFamily}
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("contact", contact, e)}
      />

      {/* RENDER SECTIONS IN ORDER */}
      {sectionOrder.map((section) => renderSection(section))}

      {/* Elegant bottom accent */}
      <Rect
        x={0}
        y={Math.max(...Object.values(positions.sections).map((p) => p.content + 80))}
        width={canvasWidth}
        height={40}
        fill={theme.primary}
        opacity={0.06}
      />
      <Text
        text="Elegantly Designed Professional Resume"
        x={0}
        y={Math.max(...Object.values(positions.sections).map((p) => p.content + 80)) + 15}
        width={canvasWidth}
        align="center"
        fontSize={responsive.fontSize.small}
        fill="#888"
        fontFamily={theme.fontFamily}
        letterSpacing={0.8}
      />
    </Layer>
  );
}