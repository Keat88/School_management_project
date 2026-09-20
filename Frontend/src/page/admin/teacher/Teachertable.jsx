import React from "react";
import { Edit, Trash2, Hash, Users } from "lucide-react";

function initials(name = "") {
  return name ? name.charAt(0).toUpperCase() : "T";
}

export default function TeacherTable({ teachers = [], onEditId, onDeleteId }) {
  return (
    <div className="space-y-4">
      {teachers.length === 0 ? (
        /* Empty State wrapped in a Fragment */
        <>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-xs">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Users size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                No teachers match your search.
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
            {teachers.map((teacher) => {
              const teacherName = teacher.name || "Unknown Teacher";
              const profileImage = teacher.teacher?.profile_image;
              const teacherCode = teacher.teacher?.teacher_code || "N/A";
              const qualification = teacher.teacher?.qualification || "N/A";
              const phone = teacher.teacher?.phone || "N/A";
              const gender = teacher.teacher?.gender || "-";

              return (
                <div
                  key={teacher.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3"
                >
                  {/* Top Bar: Avatar, Name, and Code */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {!profileImage ? (
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-blue-50 dark:bg-indigo-500/25 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/30">
                          {initials(teacherName)}
                        </div>
                      ) : (
                        <img
                          src={profileImage}
                          alt={teacherName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {teacherName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                          <Hash size={11} />
                          <span>{teacherCode}</span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {gender}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-slate-800 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Email
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 truncate block font-medium">
                        {teacher.email || "-"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Phone
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {phone}
                      </span>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Qualification
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">
                        {qualification}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onEditId && onEditId(teacher.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-500 hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteId && onDeleteId(teacher.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-xs"
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
          <div className="hidden md:block w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full min-w-[720px] text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                    <th className="px-4 py-3.5 font-medium">Avatar</th>
                    <th className="px-4 py-3.5 font-medium">Name</th>
                    <th className="px-4 py-3.5 font-medium">Email</th>
                    <th className="px-4 py-3.5 font-medium">Teacher Code</th>
                    <th className="px-4 py-3.5 font-medium">Qualification</th>
                    <th className="px-4 py-3.5 font-medium">Phone</th>
                    <th className="px-4 py-3.5 font-medium">Gender</th>
                    <th className="px-4 py-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {teachers.map((teacher) => {
                    const teacherName = teacher.name || "Unknown Teacher";
                    const profileImage = teacher.teacher?.profile_image;
                    const teacherCode = teacher.teacher?.teacher_code || "N/A";
                    const qualification = teacher.teacher?.qualification || "N/A";
                    const phone = teacher.teacher?.phone || "N/A";
                    const gender = teacher.teacher?.gender || "-";

                    return (
                      <tr
                        key={teacher.id}
                        className="transition-colors last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800/60 border-b"
                      >
                        <td className="px-4 py-3">
                          {!profileImage ? (
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-blue-50 dark:bg-indigo-500/25 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/30">
                              {initials(teacherName)}
                            </div>
                          ) : (
                            <img
                              src={profileImage}
                              alt={teacherName}
                              className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                          {teacherName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {teacher.email || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {teacherCode}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {qualification}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap capitalize">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-slate-100 dark:bg-indigo-500/20 text-slate-600 dark:text-blue-300 border border-slate-200 dark:border-indigo-500/30">
                            {gender}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button
                              onClick={() => onEditId && onEditId(teacher.id)}
                              type="button"
                              className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-500 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 border border-slate-500 dark:border-slate-700 shadow-2xs"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteId && onDeleteId(teacher.id)}
                              className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-500 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-600 shadow-xs"
                            >
                              Delete
                            </button>
                          </div>
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