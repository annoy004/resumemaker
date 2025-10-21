import React from "react";
import ProjectEntry from "../ProjectEntry";

export default function ProjectsForm({ resume, setResume, formatProjects }: any) {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        Projects
      </h2>
      <div className="space-y-4">
        {resume.projectsArray.map((proj: any, idx: number) => (
          <ProjectEntry
            key={idx}
            entry={proj}
            onChange={(field: string, value: string) => {
              const updated = [...resume.projectsArray];
              updated[idx] = { ...updated[idx], [field]: value };
              setResume({
                ...resume,
                projectsArray: updated,
                projects: formatProjects(updated),
              });
            }}
            onDelete={() => {
              const updated = resume.projectsArray.filter((_: any, i: number) => i !== idx);
              setResume({
                ...resume,
                projectsArray: updated,
                projects: formatProjects(updated),
              });
            }}
          />
        ))}
        <button
          onClick={() => {
            const updated = [
              ...resume.projectsArray,
              { title: "", techStack: "", description: "", link: "" },
            ];
            setResume({
              ...resume,
              projectsArray: updated,
              projects: formatProjects(updated),
            });
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>
    </section>
  );
}
