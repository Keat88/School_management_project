import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Image as ImageIcon,
  RotateCcw,
  BedDouble,
} from "lucide-react";
import { hostelRoomApi } from "../../../data/Hostel";
import Pagination from "../../../hooks/Pagination";

export default function ManageHostelRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  const fetchRooms = useCallback(
    async (page = 1, searchQuery = "") => {
      setLoading(true);
      try {
        const params = {
          page,
          per_page: perPage,
        };

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const response = await hostelRoomApi.getAll(params);

        // Unwrap data depending on backend pagination wrapper structure
        const result = response?.data || response || [];
        const meta = response?.meta || response;
        setRooms(result?.data);
        if (meta && typeof meta === "object" && meta.current_page) {
          setCurrentPage(meta.current_page);
          setTotalPages(meta.last_page || 1);
          setTotalItems(meta.total || result.length || 0);
        } else {
          setCurrentPage(page);
          setTotalPages(1);
          setTotalItems(result.length || 0);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setRooms([]);
          setTotalPages(1);
          setTotalItems(0);
        } else {
          console.error("Error fetching hostel rooms:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [perPage],
  );

  useEffect(() => {
    fetchRooms(currentPage, search);
  }, [currentPage, fetchRooms]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRooms(1, search);
  };

  const handleResetSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchRooms(1, "");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await hostelRoomApi.delete(id);
      setFeedback({
        type: "success",
        text: "Hostel room deleted successfully!",
      });
      fetchRooms(currentPage, search);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete hostel room.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl lg:min-w-160 mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manage Hostel Rooms
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            View, search, and manage room allocations and details
          </p>
        </div>
        <Link
          to="/admin/hostel-rooms/add"
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Plus size={16} />
          <span>Add Room</span>
        </Link>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room number, block name, or type..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={handleResetSearch}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center transition-all">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-gray-600 mt-2">
              Loading hostel rooms...
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Image</th>
                <th className="px-4 py-3.5">Hostel / Block</th>
                <th className="px-4 py-3.5">Room Info</th>
                <th className="px-4 py-3.5">Type & Gender</th>
                <th className="px-4 py-3.5">Beds & Cost</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {!loading && rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No hostel rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
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
                      <div className="text-xs text-gray-400 font-normal">
                        Block: {room.block_name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">
                      Room #{room.room_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-800 capitalize">
                        {room.type}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {room.gender}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-800 flex items-center gap-1">
                        <BedDouble size={14} className="text-gray-400" />{" "}
                        {room.number_of_beds} Beds
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        ${room.cost_per_bed} / bed
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-md font-medium capitalize ${
                          room.status === "active" ||
                          room.status === "available"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/hostel-rooms/add/${room.id}`}
                          className="p-1.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-200 bg-gray-50 duration-200 transition-colors"
                          title="Edit"
                        >
                          Update
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
                          className="p-1.5 text-red-500 border border-gray-200 rounded-lg hover:bg-gray-200 bg-red-50 duration-200 transition-colors"
                          title="Delete"
                        >
                          Delete
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

      {/* Pagination Bar */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
