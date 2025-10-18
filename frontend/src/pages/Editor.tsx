import Navbar from "../components/Navbar";
import EditorToolbar from "../components/EditorToolbar";
import CanvasEditor from "../components/canvasEditor";

export default function Editor() {
  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "resume.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-gray-800">
      <Navbar />
      <EditorToolbar onDownload={handleDownload} />
       <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">On-Canvas Editing Demo</h1>
      <CanvasEditor />
    </div>
    </div>
  );
}
