import { useEffect, useState } from "react";
import { Check, X, Clock, Lock, Save, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../data/api";

export default function StudentAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 💡 ប្តូរឈ្មោះ state ឱ្យត្រូវ ព្រោះវាជា Object ថ្នាក់រៀន មិនមែនជា Array របស់សិស្សសុទ្ធទេ
  const [classData, setClassData] = useState(null);

  // មុខងារដូរ Status (P, A, PM) សម្រាប់សិស្សម្នាក់ៗ
  const handleStatusChange = (studentId, newStatus) => {
    setClassData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId && !s.locked ? { ...s, status: newStatus } : s,
        ),
      };
    });
  };

  // មុខងារកែ Reason/Note
  const handleReasonChange = (studentId, newReason) => {
    setClassData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId && !s.locked ? { ...s, reason: newReason } : s,
        ),
      };
    });
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`classes/${id}`);
        // 💡 ទាញយកយក Object ខាងក្នុង data មកเก็บទុកក្នុង State
        const data = res?.data?.data || res?.data;
        setClassData(data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSave = async () => {
    try {
      // 1. រៀបចំទម្រង់ Data ឱ្យត្រូវទៅនឹង Backend Validation
      const payload = {
        attendance_date: new Date().toISOString().split("T")[0], // យកថ្ងៃខែបច្ចុប្បន្ន (ឬបងអាចដាក់ State ថ្ងៃខែផ្សេងបាន)
        attendances:
          classData?.students.map((student) => ({
            student_id: student.id,
            status: student.status || null,
            reason: student.reason || null,
          })) || [],
      };

      // 2. ផ្ញើសំណើ POST ទៅកាន់ Backend API តាមរយៈ Route របស់ថ្នាក់
      const res = await api.post(`classes/${id}/attendance`, payload);

      if (res?.data?.success) {
        alert("Attendance saved successfully!");
        navigate(-1); // ត្រឡប់ក្រោយវិញក្រោយពេល Save រួច
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please check your connection.");
    }
  };

  return (
    <div className="w-full lg:min-w-160 mx-auto transition-colors">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Track Attendance
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {/* 💡 បង្ហាញ Grade និង Section មកពី API */}
              Grade {classData?.grade} - Section {classData?.section} • Total
              Students: {classData?.students?.length || 0}
            </p>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4 sm:px-6">Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {/* 💡 Loop យកទិន្នន័យពី classData.students */}
              {classData?.students?.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-xs font-medium whitespace-nowrap">
                    {student.gender}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {student.locked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                        <Lock size={12} /> Locked by Admin
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "P")}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            student.status === "P"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "A")}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            student.status === "A"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                          }`}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "PM")}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            student.status === "PM"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {student.locked ? (
                      <span className="text-xs text-rose-500 dark:text-rose-400 font-medium italic">
                        Attendance locked. Please meet admin for approval.
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={student.reason || ""}
                        onChange={(e) =>
                          handleReasonChange(student.id, e.target.value)
                        }
                        placeholder="Reason..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-4 sm:px-6 py-4 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Save size={16} /> Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
