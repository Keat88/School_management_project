function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function TeacherTable({ teachers = [], onEditId, onDeleteId, isDark = true }) {
  return (
    <div className={`rounded-xl border overflow-hidden shadow-sm transition-all ${
      isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-200 text-slate-800"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-sm text-left">
          <thead>
            <tr className={`border-b transition-colors ${
              isDark ? "border-slate-800 bg-slate-900/80 text-slate-400" : "border-gray-200 bg-gray-50/60 text-gray-500"
            }`}>
              <th className="px-4 py-3 font-medium">Avatar</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Teacher Code</th>
              <th className="px-4 py-3 font-medium">Qualification</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-gray-100"}`}>
            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className={`px-4 py-10 text-center text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}
                >
                  No teachers match your search.
                </td>
              </tr>
            )}

            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className={`transition-colors last:border-0 ${
                  isDark ? "hover:bg-slate-800/50 border-slate-800/60" : "hover:bg-gray-50/60 border-gray-100"
                }`}
              >
                <td className="px-4 py-3">
                  {!teacher.teacher?.profile_image ? (
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isDark ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-blue-50 text-blue-600"
                    }`}>
                      {initials(teacher.name)}
                    </div>
                  ) : (
                    <img
                      src={teacher.teacher.profile_image}
                      alt={teacher.name || "Teacher"}
                      className={`h-8 w-8 rounded-full object-cover border ${
                        isDark ? "border-slate-700" : "border-gray-200"
                      }`}
                    />
                  )}
                </td>
                <td className={`px-4 py-3 font-medium whitespace-nowrap ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                  {teacher.name}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  {teacher.email}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  {teacher.teacher?.teacher_code}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  {teacher.teacher?.qualification}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  {teacher.teacher?.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                    isDark ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-blue-50 text-blue-600"
                  }`}>
                    {teacher.teacher?.gender}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2 relative">
                    <button
                      onClick={() => onEditId(teacher.id)}
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                        isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                          : "bg-slate-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteId(teacher.id)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                        isDark
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          : "bg-red-100 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherTable;