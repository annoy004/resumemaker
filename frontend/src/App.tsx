import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import PublicResume from "./pages/PublicResume";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="/r/:slug" element={<PublicResume />} />
    </Routes>
  );
}

export default App;
