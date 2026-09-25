import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Image as ImageIcon,
  RotateCcw,
  BedDouble,
  Edit,
  Trash2,
  Building2,
} from "lucide-react";
import { hostelRoomApi } from "../../../data/Hostel";
import Pagination from "../../../hooks/Pagination";
import { colorbtn } from "../../../data/datafeature";

export default function ManageHostelRooms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  // Dynamically determine base path based on whether user is admin or supervisor
  const basePath = location.pathname.startsWith("/supervisor")
    ? "/supervisor/hostel-rooms"
    : "/admin/hostel-rooms";

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
  const handleAddRoom = () => {
    navigate(`${basePath}/add`);
  };
  const handleEdit = (id) => {
    navigate(`${basePath}/add/${id}`);
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
    <div className="lg:min-w-160 mx-auto space-y-6 font-sans text-gray-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            Manage Hostel Rooms
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            View, search, and manage room allocations and details
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRoom}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm dark:bg-blue-600 dark:hover:bg-blue-500 w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Room</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room number, block name, type..."
            className="w-full pl-9 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={handleResetSearch}
            className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700 dark:hover:bg-slate-700"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Data Section */}
      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center transition-all dark:bg-slate-900/70 rounded-xl">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin dark:border-blue-500"></div>
            <span className="text-xs font-medium text-gray-600 mt-2 dark:text-slate-400">
              Loading hostel rooms...
            </span>
          </div>
        )}

        {!loading && rooms.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
            No hostel rooms found.
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card Stack (< md) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {room.image ? (
                        <img
                          src={room.image}
                          alt={`Room ${room.room_number}`}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                          Room #{room.room_number}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 dark:text-slate-400">
                          <Building2 size={12} /> {room.hostel?.name || "N/A"}{" "}
                          (Block: {room.block_name || "-"})
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium capitalize border ${
                        room.status === "active" || room.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-xs dark:border-slate-800">
                    <div>
                      <span className="text-gray-400 block dark:text-slate-500">
                        Type & Gender
                      </span>
                      <span className="font-medium capitalize text-gray-700 dark:text-slate-300">
                        {room.type} • {room.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block dark:text-slate-500">
                        Capacity
                      </span>
                      <span className="font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                        <BedDouble size={12} /> {room.number_of_beds} Beds
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block dark:text-slate-500">
                        Rate
                      </span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        ${room.cost_per_bed}/bed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(room.id)}
                      className={colorbtn.btnedit}
                    >
                      <Edit size={14} />
                      <span>Update</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(room.id)}
                      className={colorbtn.btndelete}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Table Layout */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider dark:bg-slate-800/80 dark:border-slate-800 dark:text-slate-400">
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Hostel / Block</th>
                      <th className="px-4 py-3">Room Info</th>
                      <th className="px-4 py-3">Type & Gender</th>
                      <th className="px-4 py-3">Beds & Cost</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm dark:divide-slate-800 dark:text-slate-300">
                    {rooms.map((room) => (
                      <tr
                        key={room.id}
                        className="hover:bg-gray-50/50 transition-colors dark:hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {room.image ? (
                            <img
                              src={room.image}
                              alt={`Room ${room.room_number}`}
                              className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-slate-100">
                          <div>{room.hostel?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500 font-normal dark:text-slate-400">
                            Block: {room.block_name || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-slate-200">
                          Room #{room.room_number}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-gray-800 capitalize dark:text-slate-200">
                            {room.type}
                          </div>
                          <div className="text-xs text-gray-500 capitalize dark:text-slate-400">
                            {room.gender}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-gray-800 flex items-center gap-1 dark:text-slate-200">
                            <BedDouble
                              size={14}
                              className="text-gray-400 dark:text-slate-500"
                            />
                            {room.number_of_beds} Beds
                          </div>
                          <div className="text-xs text-emerald-600 font-medium dark:text-emerald-400">
                            ${room.cost_per_bed} / bed
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium capitalize border ${
                              room.status === "active" ||
                              room.status === "available"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(room.id)}
                              className={colorbtn.btnedit}
                              title="Update"
                            >
                              <Edit size={13} />
                              <span>Update</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(room.id)}
                              className={colorbtn.btndelete}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
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
