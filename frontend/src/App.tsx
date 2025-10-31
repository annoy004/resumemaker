import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublicResume from "./pages/PublicResume";
import Login from "./pages/Login";
import { ReactElement, useEffect, useState } from "react";
import api from "./api/axiosInstance";

const Protected = ({ children }: { children: ReactElement }): ReactElement => {
  const [status, setStatus] = useState<"checking" | "authed" | "unauthed">("checking");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await api.get("/auth/me", { withCredentials: true });
        if (mounted) setStatus("authed");
      } catch {
        if (mounted) setStatus("unauthed");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") return <div />;
  return status === "authed" ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/editor/:id" element={<Protected><Editor /></Protected>} />
      <Route path="/r/:slug" element={<PublicResume />} />
    </Routes>
  );
}

export default App;
