import React from "react";
import EducationEntry from "../EducationEntry";

export default function EducationForm({ resume, setResume, formatEducation }: any) {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🎓</span>
        Education
      </h2>
      <div className="space-y-4">
        {resume.educationArray.map((edu: any, idx: number) => (
          <EducationEntry
            key={idx}
            entry={edu}
            onChange={(field: string, value: string) => {
              const updated = [...resume.educationArray];
              updated[idx] = { ...updated[idx], [field]: value };
              setResume({
                ...resume,
                educationArray: updated,
                education: formatEducation(updated),
              });
            }}
            onDelete={() => {
              const updated = resume.educationArray.filter((_: any, i: number) => i !== idx);
              setResume({
                ...resume,
                educationArray: updated,
                education: formatEducation(updated),
              });
            }}
          />
        ))}
        <button
          onClick={() => {
            const updated = [
              ...resume.educationArray,
              { degree: "", institution: "", year: "", cgpa: "", details: "" },
            ];
            setResume({
              ...resume,
              educationArray: updated,
              education: formatEducation(updated),
            });
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>
    </section>
  );
}
