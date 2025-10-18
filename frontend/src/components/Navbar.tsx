import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b">
      <div className="flex items-center gap-2 text-xl font-semibold text-purple-600">
        🧾 ResumeXpert Canvas
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
