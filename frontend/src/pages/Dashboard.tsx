import api from "../api/axiosInstance";

export default function Dashboard() {
  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/login"; // redirect after logout
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </div>
      {/* ... rest of dashboard */}
    </div>
  );
}
