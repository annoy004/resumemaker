import React from "react";

export default function SkillsForm({ resume, setResume }: any) {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        Skills
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter skills separated by commas
        </label>
        <textarea
          value={
            resume.tempSkills ??
            resume.skills.map((s: any) => `${s.name} (${s.level})`).join(", ")
          }
          onChange={(e) =>
            setResume((prev: any) => ({
              ...prev,
              tempSkills: e.target.value,
            }))
          }
          onBlur={(e) => {
            const text = e.target.value.trim();
            if (!text) {
              setResume((prev: any) => ({ ...prev, skills: [], tempSkills: "" }));
              return;
            }
            const parsed = text.split(",").map((s) => {
              const match = s.match(/(.*)\((.*)\)/);
              return match
                ? { name: match[1].trim(), level: match[2].trim() }
                : { name: s.trim(), level: "Intermediate" };
            });
            setResume((prev: any) => ({
              ...prev,
              skills: parsed,
              tempSkills: undefined,
            }));
          }}
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          rows={3}
          placeholder="e.g. React (Advanced), TypeScript (Intermediate)"
        />
      </div>
    </section>
  );
}
