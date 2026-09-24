import { AlertTriangle } from "lucide-react";

const ModalDelete = ({ onConfirm, onCancel ,title,desciption}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 sm:p-6 shadow-xl space-y-4 text-center my-auto">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
         {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
         {desciption}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
