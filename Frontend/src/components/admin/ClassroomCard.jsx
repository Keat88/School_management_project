import React, { useMemo } from "react";
import {
  Users,
  BookOpen,
  Edit2,
  Trash2,
  ChevronRight,
  User,
} from "lucide-react";

function ClassroomCard({
  classroom = {},
  onViewDetails,
  onUpdateRoom,
  onDeleteRoom,
}) {
  const {
    name = "Classroom",
    section = "",
    academic_year = classroom?.academicYear,
    teacher = classroom?.teacher?.name ||
      classroom?.teacher_name ||
      "Unassigned",
    students_count = classroom?.studentCount ?? classroom?.students_count ?? 0,
    subjects_count = classroom?.subjectCount ?? classroom?.subjects_count ?? 0,
  } = classroom || {};

  // Extract display label for academic year safely
  const academicYearLabel = useMemo(() => {
    if (typeof academic_year === "object" && academic_year !== null) {
      return academic_year?.year || academic_year?.name || "N/A";
    }
    return academic_year || "N/A";
  }, [academic_year]);

  // Generate initials (e.g., "John Doe" -> "JD", "John" -> "J")
  const teacherInitials = useMemo(() => {
    if (
      typeof teacher !== "string" ||
      !teacher.trim() ||
      teacher === "Unassigned"
    ) {
      return null;
    }

    const words = teacher.trim().split(/\s+/);
    if (words.length >= 2) {
      return (
        words[0].charAt(0) + words[words.length - 1].charAt(0)
      ).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  }, [teacher]);

  // Defensive Handlers
  const handleViewDetails = (e) => {
    e?.stopPropagation();
    if (typeof onViewDetails === "function") {
      onViewDetails(classroom);
    }
  };

  const handleUpdateRoom = (e) => {
    e?.stopPropagation();
    if (typeof onUpdateRoom === "function") {
      onUpdateRoom(classroom);
    }
  };

  const handleDeleteRoom = (e) => {
    e?.stopPropagation();
    if (typeof onDeleteRoom === "function") {
      onDeleteRoom(classroom);
    }
  };

  return (
    <div className="group relative rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-xl hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header Title & Academic Year Badge */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 truncate tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            {section && (
              <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mt-0.5">
                Section{" "}
                <span className="text-gray-600 dark:text-slate-300 font-semibold">
                  {section}
                </span>
              </p>
            )}
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 shrink-0">
            {academicYearLabel}
          </span>
        </div>

        {/* Teacher Info */}
        <div className="mt-4 p-2.5 rounded-xl bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ring-2 ring-white dark:ring-slate-900">
            {teacherInitials ? teacherInitials : <User size={16} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-500">
              Class Teacher
            </p>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">
              {teacher}
            </p>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Students
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-100 leading-none mt-0.5">
                {students_count}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 dark:text-blue-400 shrink-0">
              <BookOpen size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Subjects
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-100 leading-none mt-0.5">
                {subjects_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleViewDetails}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98]"
        >
          View Details
          <ChevronRight size={14} />
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleUpdateRoom}
            title="Edit Classroom"
            aria-label="Edit Classroom"
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={handleDeleteRoom}
            title="Delete Classroom"
            aria-label="Delete Classroom"
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ClassroomCard);
