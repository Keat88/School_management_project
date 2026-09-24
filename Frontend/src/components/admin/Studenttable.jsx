import React from "react";
import { Eye, Edit, Trash2, Users, Trash } from "lucide-react";
import { colorbtn } from "../../data/datafeature";
function initials(name = "") {
  return name ? name.charAt(0).toUpperCase() : "S";
}

export default function StudentTable({
  students = [],
  onView,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="space-y-4">
      {/* Loading State */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading students...
            </span>
          </div>
        </div>
      ) : !Array.isArray(students) || students.length === 0 ? (
        /* Empty State wrapped in a Fragment */
        <>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-xs">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Users size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                No student data found
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                Please try again or adjust your search filters.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* MOBILE VIEW: Card Stack (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {students.map((student) => {
              const isActive = student.status !== "inactive";
              const studentName = student.student_name || "Unknown Student";

              return (
                <div
                  key={student.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4  space-y-3"
                >
                  {/* Top Bar: Avatar, Name, and Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {student.student_image ? (
                        <img
                          src={student.student_image}
                          alt={studentName}
                          className="w-10 h-10 object-cover rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                          {initials(studentName)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {studentName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          ID: #{student.id}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-slate-800 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Roll Number
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {student.roll_number || "N/A"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Class
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">
                        {student.class_room
                          ? `Grade ${student.class_room.grade} (${student.class_room.section})`
                          : "N/A"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Gender
                      </span>
                      <span className="capitalize text-slate-700 dark:text-slate-300">
                        {student.gender || "-"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Email
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 truncate block">
                        {student.email || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex​ justify-between w-full items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onView && onView(student.id)}
                      className={colorbtn.btnview}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(student.id)}
                      className={colorbtn.btnedit}
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(student.id)}
                      className={colorbtn.btndelete}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW: Table Layout (hidden md:block) */}
          <div className="hidden md:block border border-slate-200 dark:border-slate-800  p-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((student) => {
                    const isActive = student.status !== "inactive";
                    const studentName =
                      student.student_name || "Unknown Student";

                    return (
                      <tr
                        key={student.id}
                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      >
                        {/* ID */}
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-slate-500 dark:text-slate-400">
                          #{student.id}
                        </td>

                        {/* Student Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                              {initials(studentName)}
                            </div>
                            <span className="font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                              {studentName}
                            </span>
                          </div>
                        </td>

                        {/* Student Image */}
                        <td className="px-4 py-2">
                          {student.student_image ? (
                            <img
                              src={student.student_image}
                              alt={studentName}
                              className="w-9 h-9 object-cover rounded-full border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full border flex items-center justify-center text-[10px] font-medium bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                              N/A
                            </div>
                          )}
                        </td>

                        {/* Roll Number */}
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono text-xs">
                          {student.roll_number || "N/A"}
                        </td>

                        {/* Class */}
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {student.class_room
                            ? `Grade ${student.class_room.grade} (${student.class_room.section})`
                            : "N/A"}
                        </td>

                        {/* Gender */}
                        <td className="px-4 py-3 capitalize whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {student.gender || "-"}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {student.email || "-"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            type="button"
                            onClick={() => onView && onView(student.id)}
                            className={colorbtn.btnview}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit && onEdit(student.id)}
                            className={colorbtn.btnedit}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete && onDelete(student.id)}
                            className={colorbtn.btndelete}
                          >
                            <Trash size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
