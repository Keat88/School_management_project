export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-gray-700">Loading, please wait...</span>
      </div>
    </div>
  );
}