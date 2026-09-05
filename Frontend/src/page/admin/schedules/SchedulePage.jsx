import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { days, SchedultApi } from "../../../data/schedules";
import ScheduleFilters from "../../../components/admin/ScheduleFilters";
import ScheduleGrid from "../../../components/admin/ScheduleGrid";

function SchedulePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [schedules, setSchedules] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const fetchSchedules = async (filters = {}) => {
    try {
      const response = await SchedultApi.getAll(filters);
      const data = response.data || [];
      setSchedules(data);
      const uniqueClasses = [...new Set(data.map((s) => s.class_room).filter(Boolean))].sort();
      if (classFilter === "all" && uniqueClasses.length > 0) {
        setClassOptions(uniqueClasses);
      }
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    }
  };
  useEffect(() => {
    const params = {};
    if (classFilter !== "all") params.class = classFilter;
    if (dayFilter !== "all") params.day = dayFilter;

    fetchSchedules(params);
  }, [classFilter, dayFilter]);

  // Since backend handles filtering, schedules are already filtered
  const classes = useMemo(() => {
    return [...new Set(schedules.map((s) => s.class_room).filter(Boolean))].sort();
  }, [schedules]);

  // Group backend data by class and day for the grid
  const schedulesByClass = useMemo(() => {
    const grouped = {};
    schedules.forEach((schedule) => {
      const className = schedule.class_room;
      const day = schedule.day;
      if (!className || !day) return;

      if (!grouped[className]) {
        grouped[className] = {};
      }
      if (!grouped[className][day]) {
        grouped[className][day] = [];
      }
      grouped[className][day].push(schedule);
    });
    return grouped;
  }, [schedules]);

  const handleAddSchedule = () => {
    navigate("/schedule-form");
  };

  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Schedule</h2>
        <span className="text-sm text-gray-500">
          {schedules.length} scheduled periods
        </span>
      </div>

      <ScheduleFilters
        classFilter={classFilter}
        onClassChange={setClassFilter}
        dayFilter={dayFilter}
        onDayChange={setDayFilter}
        classOptions={classOptions}
        dayOptions={days}
        onAddSchedule={handleAddSchedule}
      />
      <ScheduleGrid
        classes={classes}
        schedulesByClass={schedulesByClass}
        emptyMessage="No schedules match your filters."
      />
    </div>
  );
}

export default SchedulePage;