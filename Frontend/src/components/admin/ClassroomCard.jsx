import { Users, BookOpen } from "lucide-react";

function ClassroomCard({
  classroom,
  onViewDetails,
  onUpdateRoom,
  onDeleteRoom,
}) {
  const { name, section, academicYear, teacher, studentCount, subjectCount } =
    classroom;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">Section {section}</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-400 shrink-0">
            {academicYear}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
            {teacher?.charAt(0) || "T"}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Class Teacher</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {teacher}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 px-3 py-2 flex items-center gap-2">
            <Users size={15} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {studentCount}
              </p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2 flex items-center gap-2">
            <BookOpen size={15} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {subjectCount}
              </p>
              <p className="text-xs text-gray-500">Subjects</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col"></div>
      <button
        type="button"
        onClick={() => onViewDetails(classroom)}
        className="mt-5 w-full rounded-lg border border-gray-200 text-sm font-medium text-gray-700
        py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        View Details
      </button>
      <div className="flex justify-between items-center gap-1">
        <button
          type="button"
          onClick={() => onUpdateRoom(classroom)}
          className="mt-5 w-full rounded-lg border border-gray-200 text-sm font-medium text-blue-500
          py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Update
        </button>
        <button
          type="button"
          onClick={() => onDeleteRoom(classroom)}
          className="mt-5 w-full rounded-lg border border-gray-200 text-sm font-medium text-red-500
          py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ClassroomCard;
