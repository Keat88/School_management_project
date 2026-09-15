import { useState } from "react";
import {
  LuUsers,
  LuBookOpen,
  LuCalendar,
  LuSquareCheck,
  LuClipboardList,
  LuSearch,
  LuArrowRight,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function TeacherClassManagement({ onSelectAction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [classes] = useState([
    {
      id: 1,
      name: "Grade 12A - Full-Stack Web",
      subject: "Web Development (React & Laravel)",
      room: "Lab 3",
      schedule: "Mon, Wed, Fri (08:00 AM - 09:30 AM)",
      totalStudents: 32,
      attendanceRate: "95%",
    },
    {
      id: 2,
      name: "Grade 11B - OOP Concepts",
      subject: "Object-Oriented Programming (Java)",
      room: "Room 204",
      schedule: "Tue, Thu (10:00 AM - 11:30 AM)",
      totalStudents: 38,
      attendanceRate: "92%",
    },
    {
      id: 3,
      name: "Grade 12B - Database Design",
      subject: "MySQL & Relational Architecture",
      room: "Lab 1",
      schedule: "Mon, Wed (01:30 PM - 03:00 PM)",
      totalStudents: 35,
      attendanceRate: "97%",
    },
  ]);
  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleToAttendance = () => {
    navigate("/teacher/attendance");
  };
  const handleToScore = () => {
    navigate("/teacher/score");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-sans text-slate-800 dark:text-slate-100">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
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
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
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
                    <LuBookOpen size={14} className="text-slate-400 shrink-0" />
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
                onClick={handleToAttendance}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LuSquareCheck size={14} />
                <span>Attendance</span>
              </button>

              <button
                onClick={handleToScore}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <LuClipboardList size={14} />
                <span>Scores</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
