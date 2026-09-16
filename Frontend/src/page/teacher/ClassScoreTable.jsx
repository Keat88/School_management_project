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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [classData, setClassData] = useState(initialClassData);

  const handleScoreChange = (id, field, value) => {
    setClassData((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === id ? { ...student, [field]: value } : student,
      ),
    }));
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleSaveScores = () => {
    alert("Scores saved successfully to backend!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100  font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation & Back Button */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200 dark:border-slate-800 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Class
          </button>
        </div>

        {/* Class Details Banner Card */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {classData.name}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created Date:{" "}
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {classData.createdDate}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 bg-slate-100 dark:bg-slate-950/60 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Total Students
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-indigo-400">
                {classData.totalStudents} Students
              </p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Term & Time
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {classData.termTime}
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100/70 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Student Scoring & Evaluation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage student attendance, activities, and exam scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={14} /> Refresh Table
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              <Users size={14} /> Group
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              <FileText size={14} /> Request Certificate
            </button>
            <button
              type="button"
              onClick={handleSaveScores}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white shadow-sm transition-all cursor-pointer"
            >
              <Save size={14} /> Save Score
            </button>
          </div>
        </div>

        {/* Main Data Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {classData.students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 text-center font-medium text-slate-400 dark:text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {student.name}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">
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
                        className="w-20 text-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                        className="w-20 text-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                        className="w-20 text-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          aria-label="View Details"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Sync status"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Edit student record"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete student record"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
