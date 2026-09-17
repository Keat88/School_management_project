import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Save, Upload } from "lucide-react";
import { hostelRoomApi, HotelCagegoryApi } from "../../../data/Hostel";

export default function HostelRoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [hostels, setHostels] = useState([]);
  const [hostelId, setHostelId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [blockName, setBlockName] = useState("");
  const [type, setType] = useState("standard");
  const [gender, setGender] = useState("unisex");
  const [numberOfBeds, setNumberOfBeds] = useState("");
  const [costPerBed, setCostPerBed] = useState("");
  const [status, setStatus] = useState("available");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setFetching(true);
        // Fetch hostels dropdown options
        const hostelsRes = await HotelCagegoryApi.getAll();
        const hostelsData =
          hostelsRes?.data?.data || hostelsRes?.data || hostelsRes || [];
        setHostels(Array.isArray(hostelsData) ? hostelsData : []);

        if (isEditing) {
          const roomRes = await hostelRoomApi.getShow(id);
          const room = roomRes?.data?.data || roomRes?.data || roomRes;

          if (room) {
            setHostelId(room.hostel_id ? String(room.hostel_id) : "");
            setRoomNumber(room.room_number || "");
            setBlockName(room.block_name || "");
            setType(room.type || "standard");
            setGender(room.gender || "unisex");
            setNumberOfBeds(room.number_of_beds || "");
            setCostPerBed(room.cost_per_bed || "");
            setStatus(room.status || "available");
            setImagePreview(room.image || null);
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        setFeedback({
          type: "error",
          text: "Failed to load form dependencies.",
        });
      } finally {
        setFetching(false);
      }
    };

    loadInitialData();
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("hostel_id", hostelId);
    formData.append("room_number", roomNumber);
    formData.append("block_name", blockName);
    formData.append("type", type);
    formData.append("gender", gender);
    formData.append("number_of_beds", numberOfBeds);
    formData.append("cost_per_bed", costPerBed);
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEditing) {
        // Method spoofing for Laravel Multipart FormData requests
        formData.append("_method", "PUT");
        // កត់សម្គាល់៖ ប្រសិនបើ API service របស់អ្នកប្រើ put សូមប្តូរទៅ post ប្រសិនបើติดបញ្ហា File Upload
        await hostelRoomApi.upDate(id, formData);
      } else {
        await hostelRoomApi.addNew(formData);
      }

      setFeedback({
        type: "success",
        text: isEditing
          ? "Room updated successfully!"
          : "Room created successfully!",
      });

      setTimeout(() => navigate("/admin/hostel-rooms"), 1000);
    } catch (error) {
      console.error("Form submit error:", error);
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save room details. Please check inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center space-y-3 dark:text-slate-100">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin dark:border-blue-500"></div>
        <p className="text-gray-500 text-sm font-medium dark:text-slate-400">
          Loading room details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto  space-y-6 font-sans text-gray-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50">
            {isEditing ? "Edit Hostel Room" : "Add New Hostel Room"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 dark:text-slate-400">
            {isEditing
              ? "Update room information and configuration"
              : "Fill in details to register a new hostel room"}
          </p>
        </div>
       
      </div>

      {/* Feedback Banner */}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-6 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Hostel *
              </label>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-400 cursor-pointer"
              >
                <option value="">Select Hostel</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Room Number *
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                placeholder="e.g. 102"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Block Name
              </label>
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                placeholder="e.g. Block A"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Room Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-400 cursor-pointer"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="vip">VIP</option>
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-slate-800" />

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
            Specifications & Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all capitalize dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-400 cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Number of Beds *
              </label>
              <input
                type="number"
                min="1"
                value={numberOfBeds}
                onChange={(e) => setNumberOfBeds(e.target.value)}
                required
                placeholder="e.g. 2"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                Cost Per Bed ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPerBed}
                onChange={(e) => setCostPerBed(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/80 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all capitalize dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:border-blue-400 cursor-pointer"
            >
              <option value="available">Available</option>
              <option value="full">Occupied (Full)</option>{" "}
              {/* ប្តូរ value ជា full */}
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-slate-800" />

        {/* Media Upload */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">
            Room Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
            {imagePreview ? (
              <div className="relative group shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-xs dark:border-slate-700"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                <ImageIcon size={28} />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-xs transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
                <Upload size={16} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
          <Link
            to="/admin/hostel-rooms"
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 text-center transition-colors dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500 active:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs cursor-pointer"
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditing ? "Update Room" : "Save Room"}
          </button>
        </div>
      </form>
    </div>
  );
}
