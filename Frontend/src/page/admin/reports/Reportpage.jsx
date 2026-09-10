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

  // Inside your React Component:
  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);

  const [reportStats, setReportStats] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [feeCollectionByMonth, setFeeCollectionByMonth] = useState([]);
  const [performanceBySubject, setPerformanceBySubject] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data whenever startDate or endDate changes
  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Safely extract data based on your API response structure
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

  const handleExportPdf = async () => {
    try {
      const response = await api.get("/reports/export-pdf", {
        params: { start_date: startDate, end_date: endDate },
        responseType: "blob", // ចាំបាច់ណាស់សម្រាប់ဖाइल Binary
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
        responseType: "blob", // ចាំបាច់សម្រាប់ဖाइल CSV ឬ Excel
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
        <div className="text-center py-10 text-gray-500 font-medium">
          Loading report data...
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
