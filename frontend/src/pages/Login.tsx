import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ✅ Check if already logged in
  useEffect(() => {
    api.get("/auth/me")
      .then(() => {
        // already logged in → go to dashboard
        navigate("/");
      })
      .catch(() => {
        // not logged in → stay on login page
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const onSuccess = async (res: any) => {
    const decoded: any = jwtDecode(res.credential);
    const { email, name, picture, sub } = decoded;
    await api.post("/auth/google", { email, name, picture, sub });
    navigate("/"); // go to dashboard
  };

  const onError = () => console.log("Google Login Failed");

  if (loading) return <div className="h-screen flex items-center justify-center text-sm sm:text-base">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Login to ResumeMaker</h1>
        <p className="text-gray-600 text-xs sm:text-sm text-center mb-4 sm:mb-6">Sign in with Google to continue</p>
        <div className="flex items-center justify-center">
          <GoogleLogin onSuccess={onSuccess} onError={onError} />
        </div>
      </div>
    </div>
  );
}
