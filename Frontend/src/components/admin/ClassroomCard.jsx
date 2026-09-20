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
    <div className="group relative rounded-lg border bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      <div>
        {/* Header Title & Academic Year Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight group-hover:text-gray-400 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            {section && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Section{" "}
                <span className="text-slate-700 dark:text-slate-200 font-semibold">
                  {section}
                </span>
              </p>
            )}
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shrink-0">
            {academicYearLabel}
          </span>
        </div>

        {/* Teacher Info */}
        <div className="mt-4 p-3 rounded-xl border bg-slate-50/60 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shadow-2xs shrink-0">
            {teacherInitials ? teacherInitials : <User size={16} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
              Class Teacher
            </p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {teacher}
            </p>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Students
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mt-0.5">
                {students_count}
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
              <BookOpen size={16} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Subjects
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mt-0.5">
                {subjects_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleViewDetails}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all duration-150 shadow-2xs cursor-pointer active:scale-95"
        >
          <span>View Details</span>
          <ChevronRight size={14} />
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleUpdateRoom}
            title="Edit Classroom"
            aria-label="Edit Classroom"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={handleDeleteRoom}
            title="Delete Classroom"
            aria-label="Delete Classroom"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ClassroomCard);