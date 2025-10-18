export default function EditorToolbar({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex justify-end px-8 py-3 bg-gray-50 border-b">
      <button
        onClick={onDownload}
        className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition"
      >
        Download
      </button>
    </div>
  );
}
