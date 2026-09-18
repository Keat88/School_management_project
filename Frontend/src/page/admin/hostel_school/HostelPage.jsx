import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Search, Users, Edit3, Trash2 } from "lucide-react";
import { hostelApi } from "../../../data/Hostel";

export default function HostelPage() {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelApi.getAll();
      const data = res.data?.data || res.data;
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load hostels", err);
      setTimeout(() => {
        setFeedback({
          type: "error",
          text: "Failed to load dormitory buildings.",
        });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const filteredHostels = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return hostels.filter((hostel) => {
      const matchesSearch =
        hostel.name.toLowerCase().includes(query) ||
        (hostel.address && hostel.address.toLowerCase().includes(query));
      const matchesType = typeFilter === "all" || hostel.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [hostels, searchValue, typeFilter]);

  const handleAddHostel = () => {
    navigate("/admin/hostel/add");
  };

  const handleEdit = (hostel) => {
    navigate(`/admin/hostel/add/${hostel.id}`);
  };

  const handleDelete = async (hostel) => {
    if (!window.confirm(`Are you sure you want to delete ${hostel.name}?`))
      return;
    try {
      await hostelApi.delete(hostel.id);
      setHostels((prev) => prev.filter((h) => h.id !== hostel.id));
      setFeedback({
        type: "success",
        text: "Hostel building deleted successfully.",
      });
    } catch (err) {
      console.error("Failed to delete hostel", err);
      setFeedback({ type: "error", text: "Failed to delete hostel building." });
    }
  };

  const totalMale = hostels.filter((h) => h.type === "male").length;
  const totalFemale = hostels.filter((h) => h.type === "female").length;
  const totalOthers = hostels.filter((h) => h.type === "others").length;
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-gray-900 dark:text-slate-100 transition-colors duration-200 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-slate-50">
            Dormitory Buildings Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 dark:text-slate-400">
            Manage campus dormitory buildings, categories, and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddHostel}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500 active:bg-blue-700 shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} /> Add Building
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Building Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Buildings */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center gap-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 dark:bg-slate-800 dark:text-slate-300">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider dark:text-slate-400">
              Total Buildings
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {hostels.length}
            </p>
          </div>
        </div>

        {/* Male Dorms */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center gap-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 dark:bg-slate-800 dark:text-slate-300">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider dark:text-slate-400">
              Male Dorms
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalMale}
            </p>
          </div>
        </div>

        {/* Female Dorms */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center gap-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 dark:bg-slate-800 dark:text-slate-300">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider dark:text-slate-400">
              Female Dorms
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalFemale}
            </p>
          </div>
        </div>

        {/* Other Dorms */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center gap-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 dark:bg-slate-800 dark:text-slate-300">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider dark:text-slate-400">
              Other Dorms
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalOthers}
            </p>
          </div>
        </div>
      </div>
      {/* Search, Filter & Building Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search building name or address..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-blue-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 sm:w-48 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-400 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm dark:text-slate-400 bg-white border border-gray-200 rounded-xl dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
              <span>Loading dormitory buildings...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-semibold uppercase tracking-wider bg-gray-50/90 border-gray-200 text-gray-600 dark:bg-slate-800/80 dark:border-slate-800 dark:text-slate-300">
                  <th className="py-3.5 px-4 text-center w-16">#</th>
                  <th className="py-3.5 px-4">Building Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm divide-gray-100 text-gray-700 dark:divide-slate-800 dark:text-slate-300">
                {filteredHostels.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-gray-400 dark:text-slate-500"
                    >
                      No dormitory buildings found.
                    </td>
                  </tr>
                ) : (
                  filteredHostels.map((hostel, index) => (
                    <tr
                      key={hostel.id}
                      className="transition-colors hover:bg-gray-50/60 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3.5 px-4 text-center font-medium text-gray-500 dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        {hostel.name}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-medium inline-block ${
                            hostel.type === "male"
                              ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"
                              : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {hostel.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-slate-400">
                        {hostel.address || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(hostel)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-block bg-slate-600 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 shadow-xs cursor-pointer"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hostel)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-block bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
