import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/EditorToolbar";
import CanvasEditor from "../components/canvasEditor";
import jsPDF from "jspdf";

export default function Editor() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);

  const handleDownloadPDF = () => {
    if (!resumeData || !themeData) {
      alert("Resume not ready yet!");
      return;
    }

    const doc = new jsPDF("p", "pt", "a4");
    const left = 50;
    let y = 60;

    // Header
    doc.setFont(themeData.fontFamily || "Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(themeData.primary || "#2563eb");
    doc.text(resumeData.name || "Your Name", left, y);
    y += 28;

    doc.setFont(themeData.fontFamily || "Helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("#333");
    doc.text(resumeData.designation || "Your Role", left, y);
    y += 25;

    doc.setDrawColor(150);
    doc.line(left, y, 550, y);
    y += 30;

    // Helper for all sections
    const addSection = (title: string, content: any) => {
      doc.setFont(themeData.fontFamily || "Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(themeData.primary || "#2563eb");
      doc.text(title.toUpperCase(), left, y);
      y += 10;
      doc.line(left, y, left + 50, y);
      y += 15;

      doc.setFont(themeData.fontFamily || "Helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor("#444");

      // ✅ Convert arrays & objects into clean text
      let textContent = "";

      if (Array.isArray(content)) {
        // Handle Experience, Skills, etc.
        textContent = content
          .map((item: any) => {
            if (typeof item === "string") return item;

            // Handle Experience entries
            if (item.title) {
              return `${item.title} — ${item.company || ""} (${item.period || ""})\n${item.description || ""}`;
            }

            // Handle Skills entries
            if (item.name) {
              return `${item.name} — ${item.level || ""}`;
            }

            return JSON.stringify(item, null, 2);
          })
          .join("\n\n");
      } else if (typeof content === "object") {
        textContent = JSON.stringify(content, null, 2);
      } else {
        textContent = String(content || "");
      }

      // Split large text into wrapped lines
      const splitText = doc.splitTextToSize(textContent, 500);
      doc.text(splitText, left, y);
      y += splitText.length * 14 + 20;
    };

    // Sections
    addSection("Profile Summary", resumeData.summary);
    addSection("Experience", resumeData.experience);
    addSection("Projects", resumeData.projects);
    addSection("Skills", resumeData.skills);
    addSection("Education", resumeData.education);
    addSection("Contact", resumeData.contact);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor("#999");
    doc.text("Generated via ResumeMaker", 220, 820);

    // Save
    const safeName = resumeData.name ? resumeData.name.replace(/\s+/g, "_") : "Resume";
    doc.save(`${safeName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-gray-800">
      <Navbar />
      <EditorToolbar handleDownloadPDF={handleDownloadPDF} />

      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">On-Canvas Editing Demo</h1>

        <CanvasEditor
          onDataChange={({ resume, theme }) => {
            setResumeData(resume);
            setThemeData(theme);
          }}
        />
      </div>
    </div>
  );
}
