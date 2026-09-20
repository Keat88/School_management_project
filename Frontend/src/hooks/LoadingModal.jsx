const LoadingModal = ({
  isOpen = true,
  title = "Loading...",
  subtitle = "Please wait a moment",
  fullScreen = true,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10"
      } flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn`}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs text-center border border-slate-100 transform transition-all">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-blue-600">
            SM
          </div>
        </div>
        <h3 className="text-base font-semibold text-slate-800 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
export default LoadingModal;
