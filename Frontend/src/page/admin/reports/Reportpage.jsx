import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  reportStats,
  attendanceTrend,
  performanceBySubject,
  feeCollectionByMonth,
  activityLogs
} from "../../../data/Reportsmock";

import StatsGrid from "../../../components/admin/StatsGrid";
import ReportHeader from "../../../components/admin/Reportheader";
import DateRangeFilter from "../../../components/admin/DataRangefilter";
import ExportButtons from "../../../components/admin/Exportbutton";
import AttendanceReportChart from "../../../components/admin/AttendanceReportCharts";
import PerformanceChart from "../../../components/admin/PerformanceCharts";
import FeeCollectionChart from "../../../components/admin/FeeCollectionChart";
import ActivityLogTable from "../../../components/admin/ActivityLogTable";

function ReportPage() {
  const { currentUser } = useAuth();

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-09-08");

  const handleExportPdf = () => {
    // Hook this up to a real PDF export (e.g. jsPDF, or a backend endpoint)
    // once the reporting API exists.
    console.log("Export PDF clicked", { startDate, endDate });
  };

  const handleExportExcel = () => {
    // Hook this up to a real Excel export (e.g. SheetJS) once the
    // reporting API exists.
    console.log("Export Excel clicked", { startDate, endDate });
  };

  // Admin-only guard. For multiple admin-only pages, consider lifting
  // this into a shared <ProtectedRoute allowedRoles={["admin"]} />.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <ReportHeader />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
        <ExportButtons
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
        />
      </div>

      <StatsGrid stats={reportStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceReportChart data={attendanceTrend} />
        <PerformanceChart data={performanceBySubject} />
      </div>

      <FeeCollectionChart data={feeCollectionByMonth} />

      <ActivityLogTable logs={activityLogs} />
    </div>
  );
}

export default ReportPage;