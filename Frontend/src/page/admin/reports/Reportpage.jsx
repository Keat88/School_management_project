import { useEffect, useState } from "react";
import StatsGrid from "../../../components/admin/StatsGrid";
import ReportHeader from "../../../components/admin/Reportheader";
import DateRangeFilter from "../../../components/admin/DataRangefilter";
import ExportButtons from "../../../components/admin/Exportbutton";
import AttendanceReportChart from "../../../components/admin/AttendanceReportCharts";
import PerformanceChart from "../../../components/admin/PerformanceCharts";
import FeeCollectionChart from "../../../components/admin/FeeCollectionChart";
import ActivityLogTable from "../../../components/admin/ActivityLogTable";
import { api } from "../../../data/api";

function ReportPage() {
  const formatDate = (date) => date.toISOString().split("T")[0];
  const todayDate = new Date();
  const today = formatDate(todayDate);
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = formatDate(lastMonthDate);

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);

  const [reportStats, setReportStats] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [feeCollectionByMonth, setFeeCollectionByMonth] = useState([]);
  const [performanceBySubject, setPerformanceBySubject] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      const resData = response?.data || response;
      const data = resData?.data || resData;

      setReportStats(data?.stats || []);
      setAttendanceTrend(data?.attendanceTrend || []);
      setActivityLogs(data?.activityLogs || []);
      setFeeCollectionByMonth(data?.feeCollectionByMonth || []);
      setPerformanceBySubject(data?.performanceBySubject || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]);

  const handleExportPdf = async () => {
    try {
      const response = await api.get("/reports/export-pdf", {
        params: { start_date: startDate, end_date: endDate },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `system-report-${startDate}-to-${endDate}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get("/reports/export-excel", {
        params: { start_date: startDate, end_date: endDate },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `system-report-${startDate}-to-${endDate}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export Excel:", error);
    }
  };

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

      {loading ? (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
            <span className="text-sm font-medium">Loading data...</span>
          </div>
        </div>
      ) : (
        <>
          <StatsGrid stats={reportStats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceReportChart data={attendanceTrend} />
            <PerformanceChart data={performanceBySubject} />
          </div>
          <FeeCollectionChart data={feeCollectionByMonth} />

          <ActivityLogTable logs={activityLogs} />
        </>
      )}
    </div>
  );
}

export default ReportPage;
