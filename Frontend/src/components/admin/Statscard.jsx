const accentStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600"
};

function StatCard({ label, value, icon: Icon, accent = "blue", trend }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 flex items-center gap-4 group  hover:-translate-y-0.5 duration-200 transition-transform">
      <div
        className={`h-11 w-11 rounded-lg flex items-center  justify-center shrink-0 ${
          accentStyles[accent] || accentStyles.blue
        }`}
      >
        {Icon && <Icon size={20} />}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-600 truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-semibold text-gray-800">{value}</p>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.startsWith("-") ? "text-red-500" : "text-green-600"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;