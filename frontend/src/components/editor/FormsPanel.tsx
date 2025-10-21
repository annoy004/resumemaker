import React, { Dispatch, SetStateAction } from "react";
import ExperienceEntry from "../ExperienceEntry";
import ProjectEntry from "../ProjectEntry";
import EducationEntry from "../EducationEntry";

interface ExperienceItem { title: string; company: string; period: string; location: string; description: string; }
interface ProjectItem { title: string; techStack: string; description: string; link: string; }
interface EducationItem { degree: string; institution: string; year: string; cgpa: string; details: string; }
interface SkillItem { name: string; level: string; }

export interface ResumeData {
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

interface FormsPanelProps {
  resume: ResumeData;
  setResume: Dispatch<SetStateAction<ResumeData>>;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
  formatProjects: (arr: ProjectItem[]) => string;
  formatEducation: (arr: EducationItem[]) => string;
  wrapperClassName?: string;
}

export default function FormsPanel({ resume, setResume, expandedSections, toggleSection, formatProjects, formatEducation, wrapperClassName }: FormsPanelProps) {
  const renderField = (field: string, label: string, rows: number = 1) => (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={(resume as any)[field]}
        onChange={(e) => setResume({ ...resume, [field]: e.target.value })}
        className="w-full text-sm border border-gray-300 rounded p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={rows}
      />
    </div>
  );

  return (
    <div className={wrapperClassName ?? "w-1/5 flex flex-col gap-2 hidden lg:block"}>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto space-y-2">
        <div className="bg-white rounded-lg shadow-sm">
          <button onClick={() => toggleSection("basic")} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-800">Basic</span>
            <span className="text-xs">{expandedSections.has("basic") ? "▼" : "▶"}</span>
          </button>
          {expandedSections.has("basic") && (
            <div className="px-3 pb-3 border-t text-sm">
              {renderField("name", "Name", 1)}
              {renderField("designation", "Designation", 1)}
              {renderField("summary", "Summary", 2)}
              {renderField("contact", "Contact", 2)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <button onClick={() => toggleSection("experience")} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-800">Experience</span>
            <span className="text-xs">{expandedSections.has("experience") ? "▼" : "▶"}</span>
          </button>
          {expandedSections.has("experience") && (
            <div className="px-3 pb-3 border-t space-y-2 text-xs">
              {resume.experience.map((exp, idx) => (
                <ExperienceEntry
                  key={idx}
                  entry={exp}
                  onChange={(field, value) => {
                    const updated = [...resume.experience];
                    updated[idx] = { ...updated[idx], [field]: value } as any;
                    setResume({ ...resume, experience: updated });
                  }}
                  onDelete={() => {
                    const updated = resume.experience.filter((_, i) => i !== idx);
                    setResume({ ...resume, experience: updated });
                  }}
                />
              ))}
              <button
                onClick={() => setResume({ ...resume, experience: [...resume.experience, { title: "", company: "", period: "", location: "", description: "" }] as any })}
                className="w-full py-1 bg-green-500 text-white rounded text-xs"
              >
                + Add
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <button onClick={() => toggleSection("projects")} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-800">Projects</span>
            <span className="text-xs">{expandedSections.has("projects") ? "▼" : "▶"}</span>
          </button>
          {expandedSections.has("projects") && (
            <div className="px-3 pb-3 border-t space-y-2 text-xs">
              {resume.projectsArray.map((proj, idx) => (
                <ProjectEntry
                  key={idx}
                  entry={proj}
                  onChange={(field, value) => {
                    const updated = [...resume.projectsArray];
                    (updated[idx] as any) = { ...updated[idx], [field]: value };
                    setResume({ ...resume, projectsArray: updated, projects: formatProjects(updated as any) });
                  }}
                  onDelete={() => {
                    const updated = resume.projectsArray.filter((_, i) => i !== idx);
                    setResume({ ...resume, projectsArray: updated, projects: formatProjects(updated as any) });
                  }}
                />
              ))}
              <button
                onClick={() => {
                  const updated = [...resume.projectsArray, { title: "", techStack: "", description: "", link: "" }];
                  setResume({ ...resume, projectsArray: updated, projects: formatProjects(updated as any) });
                }}
                className="w-full py-1 bg-green-500 text-white rounded text-xs"
              >
                + Add
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <button onClick={() => toggleSection("skills")} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-800">Skills</span>
            <span className="text-xs">{expandedSections.has("skills") ? "▼" : "▶"}</span>
          </button>
          {expandedSections.has("skills") && (
            <div className="px-3 pb-3 border-t text-xs">
              <label className="block text-xs font-medium text-gray-700 mb-1">Comma separated</label>
              <textarea
                value={
                  resume.tempSkills ??
                  resume.skills.map((s) => `${s.name} (${s.level})`).join(", ")
                }
                onChange={(e) => setResume((prev) => ({ ...prev, tempSkills: e.target.value } as any))}
                onBlur={(e) => {
                  const text = e.target.value.trim();
                  if (!text) {
                    setResume((prev) => ({ ...prev, skills: [], tempSkills: "" } as any));
                    return;
                  }
                  const parsed = text.split(",").map((s) => {
                    const match = s.match(/(.*)\((.*)\)/);
                    return match
                      ? { name: match[1].trim(), level: match[2].trim() }
                      : { name: s.trim(), level: "Intermediate" };
                  });
                  setResume((prev) => ({ ...prev, skills: parsed as any, tempSkills: undefined } as any));
                }}
                className="w-full border border-gray-300 rounded p-2 text-xs"
                rows={2}
                placeholder="React (Advanced), TypeScript (Intermediate)"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <button onClick={() => toggleSection("education")} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-800">Education</span>
            <span className="text-xs">{expandedSections.has("education") ? "▼" : "▶"}</span>
          </button>
          {expandedSections.has("education") && (
            <div className="px-3 pb-3 border-t space-y-2 text-xs">
              {resume.educationArray.map((edu, idx) => (
                <EducationEntry
                  key={idx}
                  entry={edu}
                  onChange={(field, value) => {
                    const updated = [...resume.educationArray];
                    (updated[idx] as any) = { ...updated[idx], [field]: value };
                    setResume({ ...resume, educationArray: updated, education: formatEducation(updated as any) });
                  }}
                  onDelete={() => {
                    const updated = resume.educationArray.filter((_, i) => i !== idx);
                    setResume({ ...resume, educationArray: updated, education: formatEducation(updated as any) });
                  }}
                />
              ))}
              <button
                onClick={() => {
                  const updated = [...resume.educationArray, { degree: "", institution: "", year: "", cgpa: "", details: "" }];
                  setResume({ ...resume, educationArray: updated, education: formatEducation(updated as any) });
                }}
                className="w-full py-1 bg-green-500 text-white rounded text-xs"
              >
                + Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


