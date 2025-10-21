import React from "react";
import { useResumeManager } from "../hooks/useResumeManager";
import { useAppSelector } from "../redux/hook";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}
interface ProjectItem {
  title: string;
  techStack: string;
  description: string;
  link: string;
}
interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
  details: string;
}
interface SkillItem {
  name: string;
  level: string;
}
interface Theme {
  primary: string;
  fontFamily: string;
}
interface ResumeData {
  name: string;
  designation: string;
  summary: string;
  experience: ExperienceItem[];
  projects: string;
  education: string;
  projectsArray: ProjectItem[];
  educationArray: EducationItem[];
  skills: SkillItem[];
  contact: string;
  tempSkills?: string;
}

// ✅ Define correct props
interface Props {
  resume: ResumeData;
  theme: Theme;
  template: "modern" | "elegant" | "professional" | "creative" | "minimal";
}

export default function CanvasSaveShare({ resume, theme, template }: Props) {
  const { ensureUser, saveResume, publishResume } = useResumeManager();
  const { user: currentUser } = useAppSelector((state) => state.user);

  const handleSaveAndShare = async () => {
    const email = currentUser?.email || "demo@example.com";
    const name = currentUser?.name || "Demo User";

    const user = await ensureUser(email, name);
    if (!user?.id) return alert("❌ Could not ensure user.");

    const saved = await saveResume(user.id, resume, theme, template);
    if (!saved?.id) return alert("⚠️ Failed to save resume.");

    const published = await publishResume(saved.id);
    if (published?.publicUrl) {
      const link = `${window.location.origin}${published.publicUrl}`;
      await navigator.clipboard.writeText(link);
      alert(`✅ Shareable link copied to clipboard:\n${link}`);
    } else {
      alert("⚠️ Failed to publish resume.");
    }
  };

  return (
    <button
      onClick={handleSaveAndShare}
      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
    >
      <span className="text-sm">💾</span>
      <span className="hidden xs:inline">Save & Share Resume</span>
      <span className="xs:hidden">Save & Share</span>
    </button>
  );
}
