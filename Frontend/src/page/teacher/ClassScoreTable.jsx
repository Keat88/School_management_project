import { useState } from "react";
import {
  Save,
  RefreshCw,
  Users,
  FileText,
  Eye,
  ArrowLeftRight,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";

const initialClassData = {
  name: "PHP + Laravel",
  createdDate: "2026-06-06 21:11:54",
  totalStudents: 18,
  termTime: "Sat & Sun (11:00 am - 01:30 pm)",
  students: [
    {
      id: 1,
      studentId: "3691",
      name: "Taing Daniel",
      attendanceScore: 5,
      activityScore: 0,
      examScore: 0,
    },
    {
      id: 2,
      studentId: "3575",
      name: "Svay Champey",
      attendanceScore: 0,
      activityScore: 0,
      examScore: 0,
    },
    {
      id: 3,
      studentId: "3572",
      name: "khin Utdom",
      attendanceScore: 0,
      activityScore: 0,
      examScore: 0,
    },
    {
      id: 4,
      studentId: "3573",
      name: "SEN THING",
      attendanceScore: 0,
      activityScore: 0,
      examScore: 0,
    },
    {
      id: 5,
      studentId: "3574",
      name: "Oeu Lina",
      attendanceScore: 0,
      activityScore: 0,
      examScore: 0,
    },
  ],
};

export default function ClassScoreTable() {
  const [classData, setClassData] = useState(initialClassData);

  const handleScoreChange = (id, field, value) => {
    setClassData((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === id ? { ...student, [field]: value } : student,
      ),
    }));
  };

  const handleSaveScores = () => {
    alert("Scores saved successfully to backend!");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation & Back Button */}
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft size={14} /> Back to Class
          </button>
        </div>

        {/* Class Details Banner Card */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {classData.name}
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Created Date:{" "}
              <span className="text-slate-300 font-medium">
                {classData.createdDate}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 bg-slate-900/50 px-5 py-3 rounded-xl border border-slate-700/60">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Total Students
              </p>
              <p className="text-sm font-bold text-indigo-400">
                {classData.totalStudents} Students
              </p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-700" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Term & Time
              </p>
              <p className="text-sm font-bold text-slate-200">
                {classData.termTime}
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Student Scoring & Evaluation
            </h2>
            <p className="text-xs text-slate-400">
              Manage student attendance, activities, and exam scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw size={14} /> Refresh Table
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-600/30 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Users size={14} /> Group
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 border border-amber-500/30 transition-all cursor-pointer"
            >
              <FileText size={14} /> Request Certificate
            </button>
            <button
              type="button"
              onClick={handleSaveScores}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
            >
              <Save size={14} /> Save Score
            </button>
          </div>
        </div>

        {/* Main Data Table Container */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">Nº</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Student</th>
                  <th className="py-3.5 px-4 text-center w-36">
                    Attendance Score
                  </th>
                  <th className="py-3.5 px-4 text-center w-36">
                    Activity Score
                  </th>
                  <th className="py-3.5 px-4 text-center w-36">Exam Score</th>
                  <th className="py-3.5 px-4 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-sm">
                {classData.students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200">
                        {student.name}
                      </div>
                      <div className="text-xs text-indigo-400 font-mono mt-0.5">
                        ID: {student.studentId}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        value={student.attendanceScore}
                        onChange={(e) =>
                          handleScoreChange(
                            student.id,
                            "attendanceScore",
                            e.target.value,
                          )
                        }
                        className="w-20 text-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        value={student.activityScore}
                        onChange={(e) =>
                          handleScoreChange(
                            student.id,
                            "activityScore",
                            e.target.value,
                          )
                        }
                        className="w-20 text-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        value={student.examScore}
                        onChange={(e) =>
                          handleScoreChange(
                            student.id,
                            "examScore",
                            e.target.value,
                          )
                        }
                        className="w-20 text-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700/60">
                        <button
                          type="button"
                          aria-label="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Sync status"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Edit student record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete student record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
