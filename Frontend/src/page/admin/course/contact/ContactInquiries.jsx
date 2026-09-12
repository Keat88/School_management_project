import { useState, useEffect } from "react";
import {
  Mail,
  CheckCircle,
  Trash2,
  Search,
  AlertCircle,
  Eye,
} from "lucide-react";
import { api } from "../../../../data/api";

export default function ContactInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get("/contact-inquiries", { params });
      if (response.data.status === "success") {
        const data = response.data.data;
        setInquiries(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load contact inquiries.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/contact-inquiries/${id}/status`, { status: newStatus });
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;
    try {
      await api.delete(`/contact-inquiries/${id}`);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Unread
          </span>
        );
      case "read":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Read
          </span>
        );
      case "resolved":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const inputClass = "px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900 dark:focus:border-blue-500";

  return (
    <div className="space-y-6 p-6  text-slate-900  dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Mail className="text-blue-600" size={22} />
            Contact Inquiries
          </h2>
          <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
            Manage and respond to messages submitted by users and visitors.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputClass}
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border text-xs font-medium bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/60">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
              <th className="p-3 font-semibold">Sender</th>
              <th className="p-3 font-semibold">Subject</th>
              <th className="p-3 font-semibold">Message Preview</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 dark:text-slate-500">
                  Loading inquiries...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 dark:text-slate-500">
                  No inquiries found.
                </td>
              </tr>
            ) : (
              inquiries.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="p-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {item.email}
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    {item.subject || "No Subject"}
                  </td>
                  <td className="p-3 max-w-xs truncate text-slate-500 dark:text-slate-400">
                    {item.message}
                  </td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedMessage(item)}
                      title="View Message"
                      className="p-1.5 rounded-lg border transition-colors cursor-pointer border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                    >
                      <Eye size={16} />
                    </button>
                    {item.status !== "resolved" && (
                      <button
                        onClick={() => updateStatus(item.id, "resolved")}
                        title="Mark as Resolved"
                        className="p-1.5 rounded-lg border transition-colors cursor-pointer border-emerald-200 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:hover:bg-emerald-950 dark:text-emerald-400"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteInquiry(item.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg border transition-colors cursor-pointer border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal Preview */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl border shadow-xl space-y-4 bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedMessage.subject || "Contact Message"}
                </h3>
                <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
                  From:{" "}
                  <span className="font-semibold">{selectedMessage.name}</span>{" "}
                  ({selectedMessage.email})
                </p>
              </div>
              {getStatusBadge(selectedMessage.status)}
            </div>

            <div className="p-4 rounded-xl border text-sm whitespace-pre-wrap bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200">
              {selectedMessage.message}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {selectedMessage.status === "unread" && (
                <button
                  onClick={() => {
                    updateStatus(selectedMessage.id, "read");
                    setSelectedMessage({ ...selectedMessage, status: "read" });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}