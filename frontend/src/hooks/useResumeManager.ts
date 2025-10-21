import { useCallback } from "react";

export function useResumeManager() {
  const ensureUser = useCallback(async (email: string, name: string) => {
    const res = await fetch("http://localhost:5000/api/users/ensure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    return res.json();
  }, []);

  const saveResume = useCallback(async (userId: string, resume: any, theme: any, template: string) => {
    const res = await fetch("http://localhost:5000/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title: resume.name || "Untitled Resume",
        data: resume,
        theme,
        template,
      }),
    });
    return res.json();
  }, []);

  const publishResume = useCallback(async (resumeId: string) => {
    const res = await fetch(`http://localhost:5000/api/resumes/${resumeId}/publish`, {
      method: "POST",
    });
    return res.json();
  }, []);

  return { ensureUser, saveResume, publishResume };
}
