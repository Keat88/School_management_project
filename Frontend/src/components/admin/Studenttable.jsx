import React from "react";

function initials(name = "") {
  return name ? name.charAt(0).toUpperCase() : "S";
}

function StudentTable({ students = [], onView, onEdit, onDelete, loading }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-500">
                      Loading students...
                    </span>
                  </div>
                </td>
              </tr>
            ) : Array.isArray(students) && students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                    #{student.id}
                  </td>

                  {/* Student Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold shrink-0 border border-indigo-100">
                        {initials(student.student_name)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">
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
                        className="w-9 h-9 object-cover rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Roll Number */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {student.roll_number || "N/A"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {student.class_room
                      ? `Grade ${student.class_room.grade} (${student.class_room.section})`
                      : "N/A"}
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 text-gray-600 capitalize whitespace-nowrap">
                    {student.gender || "-"}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {student.email || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium ${
                        student.status === "inactive"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-50 text-green-700 border border-green-200/60"
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
                      className="text-md border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-100 text-gray-700 transition-colors font-medium active:scale-95"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(student.id)}
                      className="text-md text-indigo-600 bg-indigo-50/50 border border-indigo-200/60 rounded-lg px-2.5 py-1 hover:bg-indigo-100 transition-colors font-medium active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(student.id)}
                      className="text-md text-red-600 bg-red-50/50 border border-red-200/60 rounded-lg px-2.5 py-1 hover:bg-red-100 transition-colors font-medium active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No student data found. Please try again or adjust your search
                  filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
