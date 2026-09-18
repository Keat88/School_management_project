import { useEffect, useState } from "react";
import {
  LuUsers,
  LuBookOpen,
  LuCalendar,
  LuSquareCheck,
  LuClipboardList,
  LuSearch,
  LuFolderSearch,
  LuRotateCcw,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { api } from "../../data/api";

export default function TeacherClassManagement({ onSelectAction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [TeacherClass, setTeacherClass] = useState([]);

  const filteredClasses = TeacherClass.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/classes/student-attendance");
        setTeacherClass(res?.data?.data || []);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">
            Loading your classrooms...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 pb-16">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">My Classes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Manage your assigned classrooms, track student attendance, and input
            scores.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <LuSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search classes or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Classes Grid or Empty State */}
      {filteredClasses.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-12 text-center shadow-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <LuFolderSearch size={30} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {TeacherClass.length === 0
                  ? "No classes assigned"
                  : "No matching classes found"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {TeacherClass.length === 0
                  ? "You currently do not have any classrooms or subjects assigned to your teaching schedule."
                  : `We couldn't find any results matching "${searchQuery}". Try checking your spelling or searching for another term.`}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <LuRotateCcw size={14} />
                <span>Reset Search</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      {cls.room}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {cls.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                  {cls.subject}
                </p>

                <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <LuCalendar size={14} className="text-slate-400 shrink-0" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LuUsers size={14} className="text-slate-400 shrink-0" />
                      <span>Enrolled Students</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cls.totalStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LuBookOpen
                        size={14}
                        className="text-slate-400 shrink-0"
                      />
                      <span>Avg Attendance</span>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {cls.attendanceRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  onClick={() => navigate(`/teacher/attendance/${cls.id}`)}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LuSquareCheck size={14} />
                  <span>Attendance</span>
                </button>

                <button
                  onClick={() => navigate(`/teacher/score/${cls.id}`)}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <LuClipboardList size={14} />
                  <span>Scores</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
