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
      setError(
        err.response?.data?.message ||
          "បរាជ័យក្នុងការទាញយកព័ត៌មានលម្អិតនៃថ្នាក់រៀន។"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClassDetail();
  }, [fetchClassDetail]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Classes
        </Link>
        <div className="rounded-2xl border border-gray-100 bg-white p-12 flex flex-col items-center justify-center gap-3 text-gray-500 shadow-xs">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="text-xs font-medium text-gray-500">
            កំពុងទាញយកព័ត៌មានថ្នាក់រៀន...
          </span>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Classes
        </Link>
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-xs font-medium text-gray-500 shadow-xs space-y-3">
          <p>{error || "រកមិនឃើញថ្នាក់រៀននេះឡើយ។"}</p>
          <button
            type="button"
            onClick={fetchClassDetail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw size={12} />
            Try Again
          </button>
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

  const studentList = Array.isArray(classroom.students) ? classroom.students : [];
  
  // Extract subjects from timetables or subjects direct key
  const subjectList = classroom.timetables
    ? [...new Set(classroom.timetables.map((t) => t.subject).filter(Boolean))]
    : Array.isArray(classroom.subjects)
    ? classroom.subjects
    : [];

  const studentCount = classroom.students_count ?? studentList.length;
  const subjectCount = classroom.subjects_count ?? subjectList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Link
          to="/admin/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Classes
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
              {classroom.name || `Grade ${classroom.grade} - ${classroom.section}`}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Class Teacher:{" "}
              <span className="font-semibold text-gray-700">{teacherName}</span>
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {academicYearLabel}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Students</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {studentCount}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Subjects</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {subjectCount}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Academic Year</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {academicYearLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-gray-800">Subjects</h3>
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
                  className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100"
                >
                  {name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            No subjects assigned to this classroom.
          </p>
        )}
      </div>

      {/* Students Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-800">
          Students in this class
        </h3>
        <StudentTable students={studentList} />
      </div>
    </div>
  );
}

export default ClassroomDetail;