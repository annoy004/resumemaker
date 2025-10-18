import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { ensureUser } from "../redux/userSlice";
import { fetchResumes, createResume } from "../redux/resumeSlice";
import { RootState } from "../redux/store";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s: RootState) => s.user.user);
  const resumes = useAppSelector((s: RootState) => s.resumes.list);

  useEffect(() => {
    dispatch(ensureUser({ email: "test@resumemaker.com", name: "John Doe" }))
      .unwrap()
      .then((user: any) => dispatch(fetchResumes(user.id)));
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Resumes</h1>
      <button
        onClick={() => user && dispatch(createResume({ userId: user.id }))}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        + Create Resume
      </button>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {resumes.map((r: any) => (
          <div key={r.id} className="p-4 border rounded bg-white shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-lg">{r.title}</h2>
            <p className="text-sm text-gray-500">
              Updated: {new Date(r.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
