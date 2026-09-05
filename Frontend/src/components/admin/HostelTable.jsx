import { GraduationCap, UserRound, Pencil, Trash2 } from "lucide-react";

function ResidentTypeBadge({ type }) {
  const isTeacher = type === "Teacher";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isTeacher ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-[#2563EB]"
      }`}
    >
      {isTeacher ? <UserRound size={12} /> : <GraduationCap size={12} />}
      {type}
    </span>
  );
}

function ResidentStatusBadge({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function HostelTable({ occupants = [], onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-230 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-4 py-3 font-medium text-gray-500">Resident</th>
              <th className="px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500">Hostel</th>
              <th className="px-4 py-3 font-medium text-gray-500">Room</th>
              <th className="px-4 py-3 font-medium text-gray-500">Check-in</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {occupants.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No residents match your search or filters.
                </td>
              </tr>
            )}

            {occupants.map((occupant) => (
              <tr
                key={occupant.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-xs font-semibold shrink-0">
                      {occupant.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 whitespace-nowrap">
                      {occupant.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ResidentTypeBadge type={occupant.type} />
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {occupant.hostel}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  <span className="font-mono text-xs text-gray-500">
                    {occupant.room}
                  </span>{" "}
                  <span className="text-gray-400">·</span>{" "}
                  <span className="text-xs text-gray-400">
                    {occupant.bed}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {occupant.checkIn}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ResidentStatusBadge status={occupant.status} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(occupant)}
                      className="p-2 rounded-lg hover:bg-blue-200 bg-blue-50  hover:text-[#2563EB] text-[#2563EB] transition-colors"
                      aria-label={`Edit ${occupant.name}`}
                    >
                      {/* <Pencil size={16} /> */}Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(occupant)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-200 bg-red-50 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${occupant.name}`}
                    >
                      {/* <Trash2 size={16} /> */}Delete
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

export default HostelTable;