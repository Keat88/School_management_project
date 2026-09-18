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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto space-y-4">
          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Classes
          </Link>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-2xs space-y-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {error || "រកមិនឃើញថ្នាក់រៀននេះឡើយ។"}
            </p>
            <button
              type="button"
              onClick={fetchClassDetail}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="lg:min-w-160 mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="w-full flex items-center justify-end">

          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors shadow-2xs"
            >
            <ArrowLeft size={14} />
            Back to Classes
          </Link>
            </div>

          <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {classroom.name ||
                  `Grade ${classroom.grade} - ${classroom.section}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Class Teacher:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {teacherName}
                </span>
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shrink-0">
              {academicYearLabel}
            </span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Total Students
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {studentCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Total Subjects
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {subjectCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 shadow-2xs">
            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Academic Year
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {academicYearLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
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

        {/* Students Table Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight px-1">
            Students in this class
          </h3>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <StudentTable students={studentList} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassroomDetail;
