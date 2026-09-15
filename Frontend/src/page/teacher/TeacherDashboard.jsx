import { useState } from "react";
import { Users, BookOpen, Calendar, CheckCircle2, Clock, Bell, ArrowRight, UserCheck } from "lucide-react";

export default function TeacherDashboard({ onOpenAttendance }) {
  const [stats] = useState({
    totalClasses: 4,
    totalStudents: 142,
    attendanceRate: "96.4%",
    pendingGrades: 12,
  });

  const [todaySchedule] = useState([
    { id: 1, time: "08:00 AM - 09:30 AM", className: "Grade 12A - Full-Stack Web", room: "Lab 3", status: "Completed" },
    { id: 2, time: "10:00 AM - 11:30 AM", className: "Grade 11B - OOP Concepts", room: "Room 204", status: "Ongoing" },
    { id: 3, time: "01:30 PM - 03:00 PM", className: "Grade 12B - Database Design", room: "Lab 1", status: "Upcoming" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-sans text-slate-800 dark:text-slate-100">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Teacher!</h1>
          <p className="text-blue-100 text-sm mt-1">Here is what is happening in your classes today. Have a great session!</p>
        </div>
        <button
          onClick={onOpenAttendance}
          className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserCheck size={16} />
          <span>Quick Track Attendance</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Classes</p>
            <h3 className="text-xl font-bold mt-0.5">{stats.totalClasses}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Students</p>
            <h3 className="text-xl font-bold mt-0.5">{stats.totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attendance Rate</p>
            <h3 className="text-xl font-bold mt-0.5">{stats.attendanceRate}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Grades</p>
            <h3 className="text-xl font-bold mt-0.5">{stats.pendingGrades}</h3>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <span>Today's Schedule</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              Monday, Sep 14
            </span>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{item.className}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      item.status === 'Ongoing' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' 
                        : item.status === 'Completed'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.time} • <span className="font-medium text-slate-700 dark:text-slate-300">{item.room}</span>
                  </p>
                </div>
                <button 
                  onClick={onOpenAttendance}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Attendance</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements / Quick Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Bell size={18} className="text-blue-600" />
              <span>School Notices</span>
            </h2>
          </div>

          <div className="space-y-3.5 flex-1">
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">Midterm Exam Schedule</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                Exam schedules for all classes have been published. Please upload your quiz marks before Friday.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">System Maintenance</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                The school server will undergo brief maintenance this Sunday at midnight.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}