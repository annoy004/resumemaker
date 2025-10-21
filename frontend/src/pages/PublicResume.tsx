import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CanvasPreview from "../components/CanvasPreview";
import type { Stage as StageType } from "konva/lib/Stage";

interface Theme {
  primary: string;
  fontFamily: string;
}

export default function PublicResume() {
  const { slug } = useParams<{ slug: string }>();
  const [resume, setResume] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>({
    primary: "#2563eb",
    fontFamily: "Poppins, sans-serif",
  });
  const [template, setTemplate] = useState<"modern" | "elegant">("modern");
  const [loading, setLoading] = useState(true);

  // ✅ Properly create a ref for the Stage
  const stageRef = useRef<StageType>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
       
        const res = await fetch(`http://localhost:5000/api/resumes/public/${slug}`);
        const data = await res.json();

        if (data?.resume) {
          setResume(data.resume.data);
          setTheme(data.resume.theme);
          setTemplate(data.resume.template || "modern");
        }
      } catch (error) {
        console.error("Error fetching public resume:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [slug]);

  if (loading) return <div className="text-center mt-8 sm:mt-10 text-sm sm:text-base">⏳ Loading resume...</div>;
  if (!resume)
    return <div className="text-center mt-8 sm:mt-10 text-red-500 text-sm sm:text-base">❌ Resume not found or is private.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center truncate max-w-full">
        {resume.name}'s Resume
      </h1>
      <div className="shadow-sm sm:shadow-lg bg-white rounded-md sm:rounded-lg p-2 sm:p-4 w-full max-w-4xl">
        <CanvasPreview
          stageRef={stageRef}  // ✅ Fixed — useRef, not null
          resume={resume}
          theme={theme}
          selectedTemplate={template}
          onEdit={() => {}}
        />
      </div>
    </div>
  );
}
