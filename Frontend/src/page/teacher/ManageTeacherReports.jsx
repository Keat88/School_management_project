import { useState, useEffect } from "react";
import {
  LuSearch,
  LuCheck,
  LuX,
  LuClock,
} from "react-icons/lu";
import { api } from "../../data/api";


export default function ManageTeacherReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Laravel backend on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.get('/teacher-notices/1'); 
        setReports(response.data.data);
      } catch (error) {
        console.error("Error fetching teacher reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optional: Send update to backend API
      // await api.put(`/reports/${id}/status`, { status: newStatus, feedback });

      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      setSelectedReport(null);
      setFeedback("");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="lg:min-w-160 mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            Teacher Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Review and process submissions from faculty members.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <LuSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition"
            />
          </div>
        </div>
      </div>

      {/* Reports Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4">Teacher & Subject</th>
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {report.teacherName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {report.subject}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                      {report.reportTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-600 dark:text-slate-300">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {report.submittedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          report.status === "Approved"
                            ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : report.status === "Rejected"
                            ? "border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {report.status === "Approved" && <LuCheck size={11} />}
                        {report.status === "Rejected" && <LuX size={11} />}
                        {report.status === "Pending" && <LuClock size={11} />}
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium transition"
                        >
                          Review
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(report.id, "Approved")
                          }
                          className="p-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition"
                          title="Quick Approve"
                        >
                          <LuCheck size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-slate-400 dark:text-slate-500"
                  >
                    No reports found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View & Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-medium uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  {selectedReport.type}
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedReport.reportTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <LuX size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="text-slate-400">Teacher</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReport.teacherName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Subject</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {selectedReport.subject}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Submitted</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReport.submittedDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Report Content
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedReport.content}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Feedback / Comments
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide notes or feedback for the teacher..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() =>
                  handleStatusChange(selectedReport.id, "Rejected")
                }
                className="px-3.5 py-1.5 border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-medium transition"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  handleStatusChange(selectedReport.id, "Approved")
                }
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-medium transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}