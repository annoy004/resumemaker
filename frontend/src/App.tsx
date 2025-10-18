import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublicResume from "./pages/PublicResume";
import Login from "./pages/Login";
import { ReactElement } from "react";

const Protected = ({ children }: { children: ReactElement }): ReactElement => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
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
