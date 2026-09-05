import { useState } from "react";
import { IoMdMore } from "react-icons/io";

function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function TeacherTable({ teachers = [], onEditId, onDeleteId }) {
  const [openRowId, setOpenRowId] = useState(null);

  const toggleMenu = (id) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-4 py-3 font-medium text-gray-500">Avatar</th>
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 font-medium text-gray-500">
                Teacher Code
              </th>
              <th className="px-4 py-3 font-medium text-gray-500">
                Qualification
              </th>
              <th className="px-4 py-3 font-medium text-gray-500">Phone</th>
              <th className="px-4 py-3 font-medium text-gray-500">Subject</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No teachers match your search.
                </td>
              </tr>
            )}

            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  {!teacher.teacher?.profile_image ? (
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      {initials(teacher.name)}
                    </div>
                  ) : (
                    <img
                      src={teacher.teacher.profile_image}
                      alt={teacher.name || "Teacher"}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {teacher.name}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {teacher.email}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {teacher.teacher?.teacher_code}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {teacher.teacher?.qualification}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {teacher.teacher?.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {teacher.subject}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3 relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu(teacher.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      <IoMdMore
                        size={20}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                      />
                    </button>

                    {openRowId === teacher.id && (
                      <div className="absolute right-0 bottom-full mb-1 w-28 flex flex-col rounded-md bg-white p-1 border border-gray-200 shadow-md z-20">
                        <button
                          onClick={() => {
                            onEditId(teacher.id);
                            setOpenRowId(null);
                          }}
                          type="button"
                          className="text-sm px-3 py-1.5 text-left text-gray-700 hover:bg-gray-100 transition-colors rounded-md font-medium"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onDeleteId(teacher.id);
                            setOpenRowId(null);
                          }}
                          className="text-sm px-3 py-1.5 text-left text-red-500 hover:bg-red-50 transition-colors rounded-md font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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