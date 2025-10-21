import React from "react";

export default function BasicInfoForm({ resume, setResume }: any) {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">👤</span>
        Basic Information
      </h2>
      <div className="space-y-4">
        {["name", "designation", "summary", "contact"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
              {field}
            </label>
            <textarea
              value={(resume as any)[field]}
              onChange={(e) => setResume({ ...resume, [field]: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={field === "summary" || field === "contact" ? 3 : 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
