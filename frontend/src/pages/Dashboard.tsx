import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { fetchResumes } from "../redux/resumeSlice";
import { RootState } from "../redux/store";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.user.user);
  const resumes = useAppSelector((state: RootState) => state.resumes.list);

  useEffect(() => {
    if (user) dispatch(fetchResumes(user.id));
  }, [dispatch, user]);

  // Static templates (for preview)
  const templates = [
    {
      id: 1,
      name: "Modern Template",
      img: "https://img.freepik.com/free-vector/modern-resume-template_23-2147883449.jpg",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      id: 2,
      name: "Professional Template",
      img: "https://img.freepik.com/free-vector/minimalist-resume-template_23-2147894210.jpg",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 3,
      name: "Creative Template",
      img: "https://img.freepik.com/free-vector/creative-resume-template_23-2147883480.jpg",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      name: "Elegant Template",
      img: "https://img.freepik.com/free-vector/elegant-resume-template_23-2147894207.jpg",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* ✅ Section 1: My Resumes */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800">My Resume</h1>
        <p className="text-gray-500 mt-1">
          Start creating your AI-powered resume for your next job role
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
          {/* Create New Resume */}
          <div
            onClick={() => navigate("/editor/new")}
            className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 transition group bg-white shadow-sm"
          >
            <span className="text-4xl text-gray-400 group-hover:text-purple-500 transition">
              +
            </span>
          </div>

          {/* Existing Resumes */}
          {resumes.length > 0 ? (
            resumes.map((resume: any, index: number) => {
              const colors = [
                "from-blue-500 to-indigo-500",
                "from-pink-500 to-fuchsia-500",
                "from-orange-400 to-red-500",
                "from-cyan-500 to-sky-400",
              ];
              const gradient = colors[index % colors.length];

              return (
                <div
                  key={resume.id}
                  className={`relative h-64 rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.03] transition`}
                  onClick={() => navigate(`/editor/${resume.id}`)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
                  ></div>

                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png"
                      alt="Resume Icon"
                      className="w-16 mb-4"
                    />
                    <h2 className="text-lg font-semibold text-center">
                      {resume.title || "Untitled Resume"}
                    </h2>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 col-span-full text-center mt-4">
              No resumes yet. Create one to get started!
            </p>
          )}
        </div>
      </div>

      {/* ✅ Section 2: Choose a Template */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Choose a Template
        </h1>
        <p className="text-gray-500 mb-4">
          Pick a style that fits your personality and career goals
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() =>
                navigate(`/editor/new?template=${template.id}`)
              }
              className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.02] transition"
            >
              {/* Template Image */}
              <img
                src={template.img}
                alt={template.name}
                className="w-full h-48 object-cover"
              />

              {/* Bottom Gradient */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${template.gradient} opacity-80`}
              ></div>

              {/* Template Info */}
              <div className="absolute bottom-2 left-4 right-4 z-10">
                <h2 className="text-white text-lg font-semibold">
                  {template.name}
                </h2>
                <p className="text-white text-sm opacity-80">
                  Click to use this template
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
