import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, Search, Building2, RotateCcw } from "lucide-react";
import { api } from "../../../data/api";


export default function ManageHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostels", {
        params: { search: search || undefined },
      });
      const result = response.data?.data || response.data || [];
      setHostels(Array.isArray(result) ? result : []);
    } catch (error) {
      if (error.response?.status === 404) {
        setHostels([]);
      } else {
        console.log("Error fetching hostels:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHostels();
  };

  const handleResetSearch = () => {
    setSearch("");
    setTimeout(fetchHostels, 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      await api.delete(`/hostels/${id}`);
      setFeedback({ type: "success", text: "Hostel deleted successfully!" });
      setHostels(hostels.filter((h) => h.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete hostel.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Manage Hostels</h2>
        <Link
          to="/hostels/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Hostel
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
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hostel name, type or address..."
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

      {/* Hostel List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Hostel Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    Loading hostels...
                  </td>
                </tr>
              ) : hostels.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    No hostels found.
                  </td>
                </tr>
              ) : (
                hostels.map((hostel) => (
                  <tr key={hostel.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Building2 size={16} />
                      </div>
                      {hostel.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
                        {hostel.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {hostel.address}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/hostels/edit/${hostel.id}`}
                          className="p-1 text-blue-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(hostel.id)}
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