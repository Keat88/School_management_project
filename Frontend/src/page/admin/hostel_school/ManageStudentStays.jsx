import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, Search, UserCheck, Calendar, RotateCcw } from "lucide-react";
import { api } from "../../../data/api";

export default function ManageStudentStays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const fetchStays = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostel-student-stays", {
        params: { search: search || undefined },
      });
      const result = response.data?.data || response.data || [];
      setStays(Array.isArray(result) ? result : []);
    } catch (error) {
      if (error.response?.status === 404) {
        setStays([]);
      } else {
        console.log("Error fetching student stays:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStays();
  };

  const handleResetSearch = () => {
    setSearch("");
    setTimeout(fetchStays, 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this stay record?")) return;
    try {
      await api.delete(`/hostel-student-stays/${id}`);
      setFeedback({ type: "success", text: "Stay record deleted successfully!" });
      setStays(stays.filter((s) => s.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete stay record.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Manage Hostel Student Stays</h2>
        <Link
          to="/hostel-stays/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Assign Room / Bed
        </Link>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className=" p-4 rounded-xl border border-gray-200 flex gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bed number or student name..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleResetSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table List */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Bed Number</th>
                <th className="px-4 py-3">Duration (Start - End)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    Loading student stays...
                  </td>
                </tr>
              ) : stays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                stays.map((stay) => (
                  <tr key={stay.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <UserCheck size={16} />
                      </div>
                      <div>
                        <div>{stay.student?.name || stay.student?.student_name || "Student #" + stay.student_id}</div>
                        <div className="text-xs text-gray-400 font-normal">{stay.student?.email || ""}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold text-gray-700">
                      Bed #{stay.bed_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{stay.start_date}</span> &rarr; <span>{stay.end_date || "Present"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        stay.status === 'active' || stay.status === 'checked-in'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {stay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/hostel-student-stays/edit/${stay.id}`}
                          className="p-1 text-blue-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(stay.id)}
                          className="p-1 text-red-500 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}