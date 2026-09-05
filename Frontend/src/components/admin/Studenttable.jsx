function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function StudentTable({ students = [], onView, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-4 py-3 font-medium text-gray-500">Student</th>
              <th className="px-4 py-3 font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 font-medium text-gray-500">Roll No.</th>
              <th className="px-4 py-3 font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 font-medium text-gray-500">Gender</th>
              <th className="px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No students match your filters.
                </td>
              </tr>
            )}

            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {initials(student.student_name)}
                    </div>
                    <span className="font-medium text-gray-800 whitespace-nowrap">
                      {student.student_name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-2">
                  <img
                    src={student.student_image}
                    alt={student.student_name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>

                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {student.roll_number
}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {student.class}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize whitespace-nowrap">
                  {student.gender}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {student.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {student.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap space-x-3">
                  <button
                    type="button"
                    onClick={() => onView && onView(student.id)}
                    className="text-sm border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-200 transform duration-200 transition-colors hover:text-green-400 font-medium"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(student.id)}
                    className="text-sm text-indigo-600 border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-100 transform duration-200 transition-colors hover:text-indigo-400 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(student.id)}
                    className="text-sm text-red-500 border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-100 transform duration-200 transition-colors hover:text-red-500 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
