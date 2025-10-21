import jsPDF from "jspdf";

export function generateResumePDF(resumeData: any, themeData: any, sectionOrder?: string[]) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Theme-driven layout scales (mirrors on-canvas ModernTemplate)
  const fontSizeSetting: number = themeData.fontSize ?? 3; // 1..5
  const fontScaleMap: Record<number, number> = { 1: 0.85, 2: 0.95, 3: 1, 4: 1.1, 5: 1.2 };
  const fontScale = fontScaleMap[Math.min(5, Math.max(1, fontSizeSetting))] || 1;

  const pageMarginSetting: number = themeData.pageMargin ?? 4; // 1..8
  const marginScale = 0.6 + ((Math.min(8, Math.max(1, pageMarginSetting)) - 1) / 7) * 1.2; // ~0.6..1.8
  const basePadding = 15; // mm
  const sideMargin = basePadding * marginScale;
  const topPadding = 12 * marginScale;
  const bottomPadding = 12 * marginScale;

  const contentWidth = pageWidth - sideMargin * 2;
  const leftColWidth = contentWidth * 0.65;
  const rightColWidth = contentWidth * 0.3;
  const gapBetweenCols = contentWidth * 0.05;

  const sectionSpacingSetting: number = themeData.sectionSpacing ?? 2; // 1..8
  const spacingScale = 0.7 + ((Math.min(8, Math.max(1, sectionSpacingSetting)) - 1) / 7) * 1.2; // ~0.7..1.9

  // Font sizes (pt)
  const titlePt = 22 * fontScale;
  const subtitlePt = 12 * fontScale;
  const sectionPt = 11 * fontScale;
  const bodyPt = 10 * fontScale;

  // Line heights
  const lineHeightFactor = themeData.lineHeight ?? 1.6;
  doc.setLineHeightFactor(lineHeightFactor);

  let y = topPadding;
  const primaryColor = themeData.primary || "#2563eb";
  const fontFamily = themeData.fontFamily || "Helvetica";

  // Default section order if not provided
  const defaultOrder = ["summary", "experience", "projects", "skills", "education", "contact"];
  const finalSectionOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  // Helper to convert any value to string
  const toString = (val: any): string => {
    if (typeof val === "string") return val;

    if (Array.isArray(val)) {
      return val
        .map((item: any) => {
          if (typeof item === "string") return item;
          if (item.title) {
            return `${item.title}\n${item.company || ""} ${item.period ? `(${item.period})` : ""}\n${item.description || ""}`.trim();
          }
          if (item.name) {
            return `${item.name} — ${item.level || ""}`;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    }

    if (typeof val === "object" && val !== null) {
      return String(val);
    }

    return String(val || "");
  };

  // Section definitions
  const sections: { [key: string]: { title: string; content: any; type: "left" | "right" } } = {
    summary: {
      title: "PROFILE SUMMARY",
      content: resumeData.summary,
      type: "left",
    },
    experience: {
      title: "EXPERIENCE",
      content: resumeData.experience,
      type: "left",
    },
    projects: {
      title: "PROJECTS",
      content: resumeData.projects,
      type: "left",
    },
    skills: {
      title: "SKILLS",
      content: resumeData.skills,
      type: "left",
    },
    education: {
      title: "EDUCATION",
      content: resumeData.education,
      type: "right",
    },
    contact: {
      title: "CONTACT",
      content: resumeData.contact,
      type: "right",
    },
  };

  // HEADER
  doc.setFont(fontFamily, "bold");
  doc.setFontSize(titlePt);
  doc.setTextColor(primaryColor);
  doc.text(toString(resumeData.name) || "Your Name", sideMargin, y);
  y += 9 * fontScale;

  doc.setFont(fontFamily, "normal");
  doc.setFontSize(subtitlePt);
  doc.setTextColor("#666");
  doc.text(toString(resumeData.designation) || "Your Role", sideMargin, y);
  y += 12 * spacingScale;

  // Divider line
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(sideMargin, y, pageWidth - sideMargin, y);
  y += 8 * spacingScale;

  let leftY = y;
  let rightY = y;

  // Render sections in the specified order
  for (const sectionKey of finalSectionOrder) {
    if (sectionKey === "name" || sectionKey === "designation") continue; // Skip header sections

    const section = sections[sectionKey];
    if (!section) continue;

    const sectionText = toString(section.content);
    if (!sectionText || sectionText.trim().length === 0) continue; // Skip empty sections

    const colWidth = section.type === "left" ? leftColWidth - 2 : rightColWidth - 2;
    const currentY = section.type === "left" ? leftY : rightY;
    const xPos = section.type === "left" ? sideMargin : sideMargin + leftColWidth + gapBetweenCols;

    // Section Title
    doc.setFont(fontFamily, "bold");
    doc.setFontSize(sectionPt);
    doc.setTextColor(primaryColor);
    doc.text(section.title, xPos, currentY);

    // Section Content
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(bodyPt);
    doc.setTextColor("#444");

    // Split to size and compute height using lineHeightFactor and font size
    const blocks = sectionKey === "experience"
      ? toString(section.content).split("\n\n").map((b: string) => b.trim()).filter((b: string) => b.length > 0)
      : [sectionText];

    let cursorY = currentY + 5 * spacingScale;
    for (const block of blocks) {
      const lines = doc.splitTextToSize(block, colWidth);
      doc.text(lines, xPos, cursorY);
      const blockHeight = lines.length * (bodyPt * 0.3527) * lineHeightFactor; // approx mm per line
      cursorY += blockHeight + 3 * spacingScale;
    }

    const sectionHeight = cursorY - currentY;

    if (section.type === "left") {
      leftY = currentY + sectionHeight;
    } else {
      rightY = currentY + sectionHeight;
    }

    // Check if we need a new page
    const maxY = Math.max(leftY, rightY);
    if (maxY > pageHeight - bottomPadding) {
      doc.addPage();
      leftY = topPadding;
      rightY = topPadding;
    }
  }

  // Save PDF
  const safeName = toString(resumeData.name).replace(/\s+/g, "_") || "Resume";
  doc.save(`${safeName}.pdf`);
}