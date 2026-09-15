import React from "react";

function initials(name = "") {
  return name ? name.charAt(0).toUpperCase() : "S";
}

export default function StudentTable({ students = [], onView, onEdit, onDelete, loading }) {
  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-5  space-y-4 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              <th className="px-4 py-3.5">#ID</th>
              <th className="px-4 py-3.5">Student</th>
              <th className="px-4 py-3.5">Image</th>
              <th className="px-4 py-3.5">Roll No.</th>
              <th className="px-4 py-3.5">Class</th>
              <th className="px-4 py-3.5">Gender</th>
              <th className="px-4 py-3.5">Email</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Loading students...
                    </span>
                  </div>
                </td>
              </tr>
            ) : Array.isArray(students) && students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-gray-50/60 dark:hover:bg-slate-800/40"
                >
                  {/* ID */}
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-gray-600 dark:text-slate-400">
                    #{student.id}
                  </td>

                  {/* Student Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900">
                        {initials(student.student_name)}
                      </div>
                      <span className="font-medium whitespace-nowrap text-gray-800 dark:text-slate-200">
                        {student.student_name}
                      </span>
                    </div>
                  </td>

                  {/* Student Image */}
                  <td className="px-4 py-2">
                    {student.student_image ? (
                      <img
                        src={student.student_image}
                        alt={student.student_name}
                        className="w-9 h-9 object-cover rounded-full border border-gray-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full border flex items-center justify-center text-[10px] font-medium bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Roll Number */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-300">
                    {student.roll_number || "N/A"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-300">
                    {student.class_room
                      ? `Grade ${student.class_room.grade} (${student.class_room.section})`
                      : "N/A"}
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 capitalize whitespace-nowrap text-gray-600 dark:text-slate-300">
                    {student.gender || "-"}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-300">
                    {student.email || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium ${
                        student.status === "inactive"
                          ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                          : "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/60 dark:border-green-900/60"
                      }`}
                    >
                      {student.status === "inactive" ? "Inactive" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onView && onView(student.id)}
                      className="text-md border rounded-lg px-2.5 py-1 transition-colors font-medium active:scale-95 cursor-pointer border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(student.id)}
                      className="text-md border rounded-lg px-2.5 py-1 transition-colors font-medium active:scale-95 cursor-pointer text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(student.id)}
                      className="text-md border rounded-lg px-2.5 py-1 transition-colors font-medium active:scale-95 cursor-pointer text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-slate-400">
                  No student data found. Please try again or adjust your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}