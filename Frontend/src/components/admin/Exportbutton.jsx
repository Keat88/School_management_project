import { FileText, FileSpreadsheet } from "lucide-react";

function ExportButtons({ onExportPdf, onExportExcel }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExportPdf}
        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-800 text-sm font-medium
          bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 px-4 py-2 shadow-sm
          hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 
          transition-colors cursor-pointer"
      >
        <FileText size={16} />
        Export PDF
      </button>
      <button
        type="button"
        onClick={onExportExcel}
        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-800 text-sm font-medium
          bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 px-4 py-2 shadow-sm
          hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 
          transition-colors cursor-pointer"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>
    </div>
  );
}

export default ExportButtons;