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
        // Fetch hostels dropdown options
        const hostelsRes = await HotelCagegoryApi.getAll();
        const hostelsData =
          hostelsRes?.data?.data || hostelsRes?.data || hostelsRes || [];
        setHostels(Array.isArray(hostelsData) ? hostelsData : []);

        if (isEditing) {
          const roomRes = await hostelRoomApi.getShow(id);
          const room = roomRes?.data?.data || roomRes?.data || roomRes;

          if (room) {
            setHostelId(room.hostel_id || "");
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
      }
      fontFinally: {
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
        // Method spoofing for Multipart FormData requests in REST APIs
        formData.append("_method", "PUT");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">
          Loading room details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/hostel-rooms"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0"
            title="Back"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Hostel Room" : "Add New Hostel Room"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {isEditing
                ? "Update room information and configuration"
                : "Fill in details to register a new hostel room"}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hostel *
              </label>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Room Number *
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                placeholder="e.g. 102"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Block Name
              </label>
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                placeholder="e.g. Block A"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Room Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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

        <hr className="border-gray-100" />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Specifications & Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all capitalize"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Number of Beds *
              </label>
              <input
                type="number"
                min="1"
                value={numberOfBeds}
                onChange={(e) => setNumberOfBeds(e.target.value)}
                required
                placeholder="e.g. 2"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all capitalize"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Media Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Room Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            {imagePreview ? (
              <div className="relative group shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 shadow-xs"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                <ImageIcon size={28} />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-xs transition-colors">
                <Upload size={16} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/admin/hostel-rooms"
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditing ? "Update Room" : "Save Room"}
          </button>
        </div>
      </form>
    </div>
  );
}
