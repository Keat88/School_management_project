import { FileText, FileSpreadsheet } from "lucide-react";

function ExportButtons({ onExportPdf, onExportExcel }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onExportPdf}
        className="flex items-center gap-2 rounded-lg border border-gray-200 text-sm font-medium
          text-gray-700 px-4 py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <FileText size={16} />
        Export PDF
      </button>
      <button
        type="button"
        onClick={onExportExcel}
        className="flex items-center gap-2 rounded-lg border border-gray-200 text-sm font-medium
          text-gray-700 px-4 py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>
    </div>
  );
}

export default ExportButtons;