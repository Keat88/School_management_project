import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Search, Users } from "lucide-react";
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

  return (
    <div className="space-y-6 font-sans dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-slate-100">
            Dormitory Buildings Management
          </h1>
          <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
            Manage campus dormitory buildings, categories, and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddHostel}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 shadow-sm transition-all cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus size={16} /> Add Building
        </button>
      </div>
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
              : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Building Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-500/15 dark:text-blue-400">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase dark:text-slate-400">
              Total Buildings
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {hostels.length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 dark:bg-blue-500/15 dark:text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase dark:text-slate-400">
              Male Dorms
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {totalMale}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="h-11 w-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 dark:bg-pink-500/15 dark:text-pink-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase dark:text-slate-400">
              Female Dorms
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {totalFemale}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 dark:bg-purple-500/15 dark:text-purple-400">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase dark:text-slate-400">
              Other Dorms
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {totalOthers}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter & Building Table Section */}
      <div className=" space-y-5">
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-100
         p-2 rounded-lg bg-white  dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search building name or address..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-600 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-900 dark:focus:border-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-600 md:w-48 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm dark:text-slate-400">
            Loading dormitory buildings...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white border border-gray-100 dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-slate-700 font-bold text-center text-sm dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="p-3">#N</th>
                  <th className="p-3">Building</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100 dark:text-slate-300 dark:divide-slate-800">
                {filteredHostels.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-400 dark:text-slate-500"
                    >
                      No dormitory buildings found.
                    </td>
                  </tr>
                ) : (
                  filteredHostels.map((hostel, index) => (
                    <tr
                      key={hostel.id}
                      className="hover:bg-gray-50 transition-colors dark:hover:bg-slate-800/50"
                    >
                      <td className="p-3 text-center font-medium text-gray-500 dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-gray-800 dark:text-slate-100">
                        {hostel.name}
                      </td>
                      <td className="p-3 text-center capitalize">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            hostel.type === "male"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
                              : hostel.type === "female"
                                ? "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300"
                                : "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300"
                          }`}
                        >
                          {hostel.type}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500 dark:text-slate-400">
                        {hostel.address || "—"}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(hostel)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hostel)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition-colors cursor-pointer dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300"
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
