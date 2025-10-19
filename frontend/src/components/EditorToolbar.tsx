export default function EditorToolbar({ handleDownloadPDF }: { handleDownloadPDF: () => void }) {
  return (
    <div className="flex justify-end px-8 py-3 bg-gray-50 border-b">
     <button
  onClick={handleDownloadPDF}
  className="mt-4 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
>
  Download as PDF
</button>
    </div>
  );
}
