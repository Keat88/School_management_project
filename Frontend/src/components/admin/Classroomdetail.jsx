import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, BookOpen, CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import classrooms from "../../data/classrooms";

import StudentTable from "./Studenttable";
import students from "../../data/StudentsApi";

function ClassroomDetail() {
  const { currentUser } = useAuth();
  const { id } = useParams();

  const classroom = useMemo(
    () => classrooms.find((c) => String(c.id) === id),
    [id]
  );
  const classStudents = useMemo(() => {
    if (!classroom) return [];
    const fullClassName = `${classroom.name} - ${classroom.section}`;
    return students.filter((s) => s.class === fullClassName);
  }, [classroom]);

  // Admin-only guard. For multiple admin-only pages, consider lifting
  // this into a shared <ProtectedRoute allowedRoles={["admin"]} />.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (!classroom) {
    return (
      <div className="space-y-4">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to Classes
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
          Classroom not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <div className="space-y-3">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to Classes
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {classroom.name} - Section {classroom.section}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Class Teacher: {classroom.teacher}
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
            {classroom.academicYear}
          </span>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-xl font-semibold text-gray-800">
              {classroom.studentCount}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Subjects</p>
            <p className="text-xl font-semibold text-gray-800">
              {classroom.subjectCount}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Academic Year</p>
            <p className="text-xl font-semibold text-gray-800">
              {classroom.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Subjects
        </h3>
        <div className="flex flex-wrap gap-2">
          {classroom.subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Students in this class */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800">
          Students in this class
        </h3>
        <StudentTable students={classStudents} />
      </div>
    </div>
  );
}

export default ClassroomDetail;