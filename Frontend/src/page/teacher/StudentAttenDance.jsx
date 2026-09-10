import { useState } from "react";
import { Check, X, Clock, Lock, Save, AlertCircle } from "lucide-react";

const initialStudents = [
  { id: 1, name: "Taing Daniel", gender: "Male", status: "P", reason: "", locked: false },
  { id: 2, name: "Svay Champey", gender: "Male", status: "P", reason: "", locked: false },
  { id: 3, name: "khin Utdom", gender: "Male", status: "", reason: "", locked: true },
  { id: 4, name: "SEN THING", gender: "Male", status: "", reason: "", locked: true },
  { id: 5, name: "Oeu Lina", gender: "Female", status: "P", reason: "", locked: false },
  { id: 6, name: "Thorn SopheakTra", gender: "Male", status: "P", reason: "Family event", locked: false },
];

export default function StudentAttendance() {
  const [students, setStudents] = useState(initialStudents);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(s => (s.id === id && !s.locked ? { ...s, status: newStatus } : s))
    );
  };

  const handleReasonChange = (id, newReason) => {
    setStudents(prev =>
      prev.map(s => (s.id === id && !s.locked ? { ...s, reason: newReason } : s))
    );
  };

  const handleSave = () => {
    alert("Attendance saved successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-100/60 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Track Attendance</h2>
            <p className="text-xs sm:text-sm text-slate-500">PHP + Laravel • Total Students: {students.length}</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Save size={16} /> Save Attendance
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4 sm:px-6">Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800">
                    {student.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600 text-xs font-medium">
                    {student.gender}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {student.locked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
                        <Lock size={12} /> Locked by Admin
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "P")}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            student.status === "P"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:bg-white"
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
                              : "text-slate-600 hover:bg-white"
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
                              : "text-slate-600 hover:bg-white"
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {student.locked ? (
                      <span className="text-xs text-rose-500 font-medium italic">
                        Attendance locked. Please meet admin for approval.
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={student.reason}
                        onChange={(e) => handleReasonChange(student.id, e.target.value)}
                        placeholder="Reason..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}