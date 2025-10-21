import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/EditorToolbar";
import CanvasEditor from "../components/canvasEditor";
import { generateResumePDF } from "../utils/pdfExport";

export default function Editor() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
    "contact",
  ]);

  const handleDownloadPDF = () => {
    if (!resumeData || !themeData) {
      alert("Resume not ready yet!");
      return;
    }
    // Pass sectionOrder to PDF export
    generateResumePDF(resumeData, themeData, sectionOrder);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-gray-800">
      <Navbar />
      <EditorToolbar handleDownloadPDF={handleDownloadPDF} />

      <div className="min-h-screen bg-gray-50 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">On-Canvas Editing Demo</h1>
        <CanvasEditor
          onDataChange={({
            resume,
            theme,
          }: {
            resume: any;
            theme: { primary: string; fontFamily: string };
          }) => {
            setResumeData(resume);
            setThemeData(theme);
          }}
          onSectionOrderChange={(newOrder: string[]) => {
            setSectionOrder(newOrder);
          }}
        />
      </div>
    </div>
  );
}