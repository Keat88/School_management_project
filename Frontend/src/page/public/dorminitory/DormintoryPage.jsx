import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Search,
  Building2,
  Bed,
  Users,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../../data/api";


export default function DormintoryPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState(null);

  // Filter and Search States matching backend parameters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(9);

  // Authentication Guard Check
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, gender, status]);

  // Fetch Hostel Rooms from Backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          per_page: perPage,
        };
        if (search.trim()) params.search = search;
        if (type) params.type = type;
        if (gender) params.gender = gender;
        if (status) params.status = status;

        const response = await api.get("/hostel-rooms", { params });
        const resData = response.data;

        const roomList = resData.data || resData || [];
        setRooms(roomList);
        setCurrentPage(resData.current_page || 1);
        setLastPage(resData.last_page || 1);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load rooms. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchRooms();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, type, gender, status, currentPage, perPage, navigate]);

  // Handle Room Booking Request
  const handleBookRoom = async (roomId) => {
    try {
      setBookingMessage(null);
      await api.post(`/hostel-rooms/${roomId}/book`);
      setBookingMessage({ type: "success", text: "Room booked successfully!" });

      // Refresh room list
      setRooms(
        rooms.map((r) => (r.id === roomId ? { ...r, status: "full" } : r)),
      );
    } catch (err) {
      setBookingMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to book room. Please try again.",
      });
    }
  };

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 dark:text-indigo-400 tracking-wider uppercase bg-blue-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-indigo-900/50">
              Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dormintory
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Select and reserve your preferred accommodation space for the
              semester.
            </p>
          </div>
        </div>

        {/* Booking Feedback Alert */}
        {bookingMessage && (
          <div
            className={`p-4 rounded-2xl text-sm font-medium flex items-center space-x-2 ${
              bookingMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400"
            }`}
          >
            {bookingMessage.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <ShieldAlert size={18} />
            )}
            <span>{bookingMessage.text}</span>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search room, block, or hostel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Room Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="vip">VIP</option>
              <option value="ac">AC</option>
              <option value="non-ac">Non-AC</option>
            </select>
          </div>
          <div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2
              className="animate-spin text-blue-600 dark:text-indigo-400"
              size={36}
            />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-xl mx-auto p-4 bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-red-700 dark:text-rose-400 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const isAvailable = room.status === "available";
              return (
                <div
                  key={room.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md group"
                >
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={
                        room.image ||
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600"
                      }
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 dark:bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs uppercase">
                        {room.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs capitalize ${
                          isAvailable
                            ? "bg-emerald-500 text-white"
                            : room.status === "full"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-500 text-white"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Room #{room.room_number}
                        </h3>
                        {room.block_name && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            Block {room.block_name}
                          </span>
                        )}
                      </div>

                      {room.hostel && (
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                          <Building2
                            size={16}
                            className="text-blue-500 flex-shrink-0"
                          />
                          <span className="text-xs font-semibold">
                            {room.hostel.name}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-1.5">
                          <Bed size={14} className="text-slate-400" />
                          <span>{room.number_of_beds} Beds</span>
                        </div>
                        <div className="flex items-center space-x-1.5 capitalize">
                          <Users size={14} className="text-slate-400" />
                          <span>{room.gender} Only</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400 block">
                          Cost / Bed
                        </span>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                          ${room.cost_per_bed}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            /mo
                          </span>
                        </span>
                      </div>
                      <button
                        disabled={!isAvailable}
                        onClick={() => handleBookRoom(room.id)}
                        className={`font-medium text-xs px-4 py-2.5 rounded-xl transition shadow-xs ${
                          isAvailable
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isAvailable ? "Reserve Bed" : "Not Available"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rooms.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Building2 size={24} className="text-blue-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No rooms available
            </h3>
            <p className="text-sm text-slate-400">
              Try modifying your filter options or check back later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pt-6 flex justify-center items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl disabled:opacity-50 text-xs font-bold"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-3">
              Page {currentPage} of {lastPage}
            </span>
            <button
              disabled={currentPage === lastPage}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, lastPage))
              }
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl disabled:opacity-50 text-xs font-bold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
