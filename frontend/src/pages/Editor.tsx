import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/EditorToolbar";
import CanvasEditor from "../components/canvasEditor";
import { generateResumePDF } from "../utils/pdfExport";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setCurrentResume, fetchResumes } from "../redux/resumeSlice";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { list: resumes, currentResume } = useAppSelector((state) => state.resumes);
  
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

  // Load resume when component mounts or ID changes
  useEffect(() => {
    if (id && resumes.length > 0) {
      const resume = resumes.find(r => r.id === id);
      if (resume) {
        dispatch(setCurrentResume(resume));
      }
    } else if (id === "new") {
      // Create a new resume for editing
      const newResume = {
        id: "temp-" + Date.now(),
        title: "New Resume",
        userId: "",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        data: {
          name: "Arnav Singh",
          designation: "Frontend Developer",
          summary: "Passionate frontend developer skilled in React, TypeScript, and UI design. Experienced in building responsive, interactive applications.",
          experience: [
            {
              title: "Frontend Developer",
              company: "Coding Community",
              period: "2024–Present",
              location: "Mumbai, India",
              description: "Built scalable UI with React and Tailwind CSS.\nIntegrated real-time APIs with Socket.IO.\nLed responsive design initiatives.",
            },
          ],
          skills: [
            { name: "React", level: "Advanced" },
            { name: "TypeScript", level: "Intermediate" },
          ],
          projectsArray: [
            {
              title: "Resume Builder App",
              techStack: "React, Node.js",
              description: "Built full MERN stack resume builder with live preview.",
              link: "",
            },
          ],
          educationArray: [
            {
              degree: "B.E. in Computer Engineering",
              institution: "TCET",
              year: "2022–2024",
              cgpa: "8.5",
              details: "",
            },
          ],
          projects: "",
          education: "",
          contact: "📧 arnav.singh@example.com\n📱 +91 98765 43210\n🌐 www.arnavportfolio.com",
          tempSkills: "",
        },
        template: "modern",
        theme: {
          primary: "#2563eb",
          fontFamily: "Poppins, sans-serif",
          fontSize: 3,
          lineHeight: 1.6,
          pageMargin: 4,
          sectionSpacing: 2,
        },
        publicSlug: null,
      };
      dispatch(setCurrentResume(newResume));
    }
  }, [id, resumes, dispatch]);

  // Load resumes if not already loaded
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && resumes.length === 0) {
      const userData = JSON.parse(user);
      dispatch(fetchResumes(userData.id));
    }
  }, [dispatch, resumes.length]);

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