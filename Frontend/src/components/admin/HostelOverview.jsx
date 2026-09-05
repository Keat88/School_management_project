import { Building2, Users, UserRound } from "lucide-react";

function HostelCard({ hostel }) {
  const percentage = Math.round((hostel.occupied / hostel.capacity) * 100);
  const full = percentage >= 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{hostel.name}</h3>
            <p className="text-xs text-gray-400">{hostel.type}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Users size={14} />
            Occupancy
          </span>
          <span className="font-medium text-gray-800">
            {hostel.occupied}/{hostel.capacity}
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              full
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-amber-400"
                  : "bg-green-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{percentage}% occupied</span>
          <span className="flex items-center gap-1">
            <UserRound size={12} />
            Warden: {hostel.warden}
          </span>
        </div>
      </div>
    </div>
  );
}

function HostelOverview({ hostels = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {hostels.map((hostel) => (
        <HostelCard key={hostel.id} hostel={hostel} />
      ))}
    </div>
  );
}

export default HostelOverview;