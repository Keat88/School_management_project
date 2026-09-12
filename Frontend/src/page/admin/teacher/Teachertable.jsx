function initials(name = "") {
  return name ? name.charAt(0).toUpperCase() : "";
}

function TeacherTable({ teachers = [], onEditId, onDeleteId }) {
  return (
    <div className=" dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/80 text-gray-500 dark:text-slate-400 transition-colors">
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
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                >
                  No teachers match your search.
                </td>
              </tr>
            )}

            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="transition-colors last:border-0 hover:bg-gray-50/60 dark:hover:bg-slate-800/50 border-gray-100 dark:border-slate-800/60 border-b"
              >
                <td className="px-4 py-3">
                  {!teacher.teacher?.profile_image ? (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-50 dark:bg-indigo-500/25 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/30">
                      {initials(teacher.name)}
                    </div>
                  ) : (
                    <img
                      src={teacher.teacher.profile_image}
                      alt={teacher.name || "Teacher"}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-800 dark:text-slate-200">
                  {teacher.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-400">
                  {teacher.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-400">
                  {teacher.teacher?.teacher_code}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-400">
                  {teacher.teacher?.qualification}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-400">
                  {teacher.teacher?.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-300 border border-blue-100 dark:border-indigo-500/30">
                    {teacher.teacher?.gender}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2 relative">
                    <button
                      onClick={() => onEditId(teacher.id)}
                      type="button"
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-white border border-gray-200 dark:border-slate-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteId(teacher.id)}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 border border-red-200/60 dark:border-red-500/20"
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