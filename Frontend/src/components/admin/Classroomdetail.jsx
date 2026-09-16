import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  BookOpen,
  CalendarDays,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import StudentTable from "./Studenttable";
import { classRoomApi } from "../../data/classrooms";

function ClassroomDetail() {
  const { currentUser } = useAuth();
  const { id } = useParams();

  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await classRoomApi.getById(id);

      // Fully unwrap Laravel API Resource response ({ data: { data: { ... } } })
      const rawData = response?.data?.data || response?.data || response;
      setClassroom(rawData);
    } catch (err) {
      console.error("Error fetching classroom details:", err);
      setError(err.response?.data?.message || "fail for access class data !");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClassDetail();
  }, [fetchClassDetail]);

  if (loading) {
    return (
      <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen w-full flex items-center justify-center transition-colors duration-300 p-4">
        <div className="w-full min-h-screen">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 shadow-xs">
            <Loader2
              size={28}
              className="animate-spin text-blue-500 dark:text-blue-400"
            />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading data class...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="lg:min-w-160 mx-auto space-y-4">
          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Classes
          </Link>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center text-xs font-medium text-slate-500 dark:text-slate-400 shadow-xs space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              {error || "រកមិនឃើញថ្នាក់រៀននេះឡើយ។"}
            </p>
            <button
              type="button"
              onClick={fetchClassDetail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safe Field Extraction
  const teacherName =
    typeof classroom.teacher === "object"
      ? classroom.teacher?.name || classroom.teacher?.full_name
      : classroom.teacher || "Unassigned";

  const academicYearLabel =
    typeof classroom.academic_year === "object"
      ? classroom.academic_year?.name || classroom.academic_year?.year
      : classroom.academic_year || "N/A";

  const studentList = Array.isArray(classroom.students)
    ? classroom.students
    : [];

  // Extract subjects from timetables or subjects direct key
  const subjectList = classroom.timetables
    ? [...new Set(classroom.timetables.map((t) => t.subject).filter(Boolean))]
    : Array.isArray(classroom.subjects)
      ? classroom.subjects
      : [];

  const studentCount = classroom.students_count ?? studentList.length;
  const subjectCount = classroom.subjects_count ?? subjectList.length;

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen  transition-colors duration-300">
      <div className="lg:min-w-160 mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-2 text-xs font-bold bg-gray-400 text-white hover:bg-gray-500 text-white-50 dark:bg-gray-700 py-2
            px-2 rounded-lg duration-200 transition-transform hover:"
          >
            <ArrowLeft size={14} />
            Back to Classes
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {classroom.name ||
                  `Grade ${classroom.grade} - ${classroom.section}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Class Teacher:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {teacherName}
                </span>
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-blue-700 dark:text-blue-400 border border-indigo-100 dark:border-blue-500/20">
              {academicYearLabel}
            </span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Students
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {studentCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Subjects
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {subjectCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-xs">
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-500/20">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Academic Year
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {academicYearLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5  space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Subjects
          </h3>
          {subjectList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subjectList.map((subject, index) => {
                const name =
                  typeof subject === "object"
                    ? subject.name || subject.subject_name
                    : subject;
                return (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              No subjects assigned to this classroom.
            </p>
          )}
        </div>

        {/* Students Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Students in this class
          </h3>
          <StudentTable students={studentList} />
        </div>
      </div>
    </div>
  );
}

export default ClassroomDetail;
