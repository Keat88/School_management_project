import StatCard from "./Statscard";

function StatsGrid({ stats = [] }) {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {safeStats.map((stat, index) => {
        const { key, label, ...rest } = stat;
        const cardKey = key || label || index;
        return <StatCard key={cardKey} label={label} {...rest} />;
      })}
    </div>
  );
}

export default StatsGrid;