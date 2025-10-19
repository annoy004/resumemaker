import React from "react";
import ExperienceEntry from "./ExperienceEntry";

export default function EditableSections({ resume, setResume }: any) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Basic Info */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Basic Information
        </h2>
        {["name", "designation", "summary", "contact"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-gray-700 capitalize mb-1">
              {field}
            </label>
            <textarea
              value={(resume as any)[field]}
              onChange={(e) =>
                setResume({ ...resume, [field]: e.target.value })
              }
              className="w-full border rounded-md p-2 bg-gray-50"
              rows={field === "summary" || field === "contact" ? 3 : 1}
            />
          </div>
        ))}
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Experience
        </h2>
        {resume.experience.map((exp: any, idx: number) => (
          <ExperienceEntry
            key={idx}
            entry={exp}
            onChange={(field: string, value: string) => {
              const updated = [...resume.experience];
              updated[idx] = { ...updated[idx], [field]: value };
              setResume({ ...resume, experience: updated });
            }}
            onDelete={() => {
              const updated = resume.experience.filter((_: any, i: number) => i !== idx);
              setResume({ ...resume, experience: updated });
            }}
          />
        ))}
        <button
          onClick={() =>
            setResume({
              ...resume,
              experience: [
                ...resume.experience,
                {
                  title: "",
                  company: "",
                  period: "",
                  location: "",
                  description: "",
                },
              ],
            })
          }
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
        >
          + Add Experience
        </button>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Projects</h2>
        <textarea
          value={resume.projects}
          onChange={(e) => setResume({ ...resume, projects: e.target.value })}
          className="w-full border rounded-md p-2 bg-gray-50"
          rows={3}
        />
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Skills</h2>
        <textarea
          value={resume.skills.map((s: any) => `${s.name} (${s.level})`).join(", ")}
          onChange={(e) =>
            setResume({
              ...resume,
              skills: e.target.value.split(",").map((s: string) => {
                const match = s.match(/(.*)\((.*)\)/);
                return match
                  ? { name: match[1].trim(), level: match[2].trim() }
                  : { name: s.trim(), level: "Intermediate" };
              }),
            })
          }
          className="w-full border rounded-md p-2 bg-gray-50"
          rows={2}
        />
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Education</h2>
        <textarea
          value={resume.education}
          onChange={(e) =>
            setResume({ ...resume, education: e.target.value })
          }
          className="w-full border rounded-md p-2 bg-gray-50"
          rows={3}
        />
      </div>
    </div>
  );
}
