import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, Search, Image as ImageIcon, RotateCcw, BedDouble } from "lucide-react";
import { api } from "../../../data/api";


export default function ManageHostelRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hostel-rooms", {
        params: { search: search || undefined },
      });
      const result = response.data?.data || response.data || [];
      setRooms(Array.isArray(result) ? result : []);
    } catch (error) {
      if (error.response?.status === 404) {
        setRooms([]);
      } else {
        console.log("Error fetching hostel rooms:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetSearch = () => {
    setSearch("");
    setTimeout(fetchRooms, 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/hostel-rooms/${id}`);
      setFeedback({ type: "success", text: "Hostel room deleted successfully!" });
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete hostel room.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Manage Hostel Rooms</h2>
        <Link
          to="/hostel-rooms/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Room
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
            placeholder="Search by room number, block name, or type..."
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

      {/* Table List View */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Hostel / Block</th>
                <th className="px-4 py-3">Room Info</th>
                <th className="px-4 py-3">Type & Gender</th>
                <th className="px-4 py-3">Beds & Cost</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Loading hostel rooms...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    No hostel rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {room.image ? (
                        <img
                          src={room.image}
                          alt={`Room ${room.room_number}`}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                      <div>{room.hostel?.name || "N/A"}</div>
                      <div className="text-xs text-gray-400 font-normal">Block: {room.block_name || "-"}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">
                      Room #{room.room_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-800 capitalize">{room.type}</div>
                      <div className="text-xs text-gray-400 capitalize">{room.gender}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-800 flex items-center gap-1">
                        <BedDouble size={14} className="text-gray-400" /> {room.number_of_beds} Beds
                      </div>
                      <div className="text-xs text-green-600 font-medium">${room.cost_per_bed} / bed</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        room.status === 'active' || room.status === 'available' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/hostel-rooms/edit/${room.id}`}
                          className="p-1 text-blue-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
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