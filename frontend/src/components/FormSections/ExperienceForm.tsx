import React from "react";
import ExperienceEntry from "../ExperienceEntry";

export default function ExperienceForm({ resume, setResume }: any) {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">💼</span>
        Experience
      </h2>
      <div className="space-y-4">
        {(Array.isArray(resume.experience) ? resume.experience : []).map(
          (exp: any, idx: number) => (
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
          )
        )}
        <button
          onClick={() =>
            setResume({
              ...resume,
              experience: [
                ...resume.experience,
                { title: "", company: "", period: "", location: "", description: "" },
              ],
            })
          }
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>
    </section>
  );
}
