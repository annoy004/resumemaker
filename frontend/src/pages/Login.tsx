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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login to ResumeMaker</h1>
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}
