import StatCard from "./Statscard";
import { 
  Users, 
  CalendarCheck, 
  Award, 
  DollarSign, 
  GraduationCap 
} from "lucide-react";

// Map backend string names to actual Lucide component references
const iconMap = {
  users: Users,
  attendance: CalendarCheck,
  performance: Award,
  fees: DollarSign,
  graduation: GraduationCap,
};

function StatsGrid({ stats = [] }) {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {safeStats.map((stat, index) => {
        const { key, label, icon, ...rest } = stat;
        const cardKey = key || label || index;

        // Resolve string icon from backend into a component, with a safe fallback
        const ResolvedIcon = typeof icon === "string" ? iconMap[icon] : icon;

        return (
          <StatCard 
            key={cardKey} 
            label={label} 
            icon={ResolvedIcon} 
            {...rest} 
          />
        );
      })}
    </div>
  );
}

export default StatsGrid;