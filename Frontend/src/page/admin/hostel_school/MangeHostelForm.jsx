import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import { api } from "../../../data/api";
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
  const [type, setType] = useState("");
  const [gender, setGender] = useState("unisex");
  const [numberOfBeds, setNumberOfBeds] = useState("");
  const [costPerBed, setCostPerBed] = useState("");
  const [status, setStatus] = useState("available");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const hostelsRes = await api.get("/hostels");
        setHostels(hostelsRes.data?.data || hostelsRes.data || []);

        if (isEditing) {
          const roomRes = await api.get(`/hostel-rooms/${id}`);
          const room = roomRes.data?.data || roomRes.data;
          setHostelId(room.hostel_id || "");
          setRoomNumber(room.room_number || "");
          setBlockName(room.block_name || "");
          setType(room.type || "");
          setGender(room.gender || "unisex");
          setNumberOfBeds(room.number_of_beds || "");
          setCostPerBed(room.cost_per_bed || "");
          setStatus(room.status || "available");
          setImagePreview(room.image || null);
        }
      } catch (error) {
        setFeedback({ type: "error", text: "Failed to load form dependencies." });
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

    if (isEditing) {
      formData.append("_method", "PUT");
    }

    try {
      const endpoint = isEditing ? `/hostel-rooms/${id}` : "/hostel-rooms";
      await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback({
        type: "success",
        text: isEditing ? "Room updated successfully!" : "Room created successfully!",
      });
      setTimeout(() => navigate("/hostel-rooms"), 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to save room details. Check inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="max-w-2xl mx-auto py-12 text-center text-gray-400 text-sm">Loading form...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/hostel-rooms"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Back"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Hostel Room" : "Add New Hostel Room"}
          </h2>
        </div>
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel *</label>
            <select
              value={hostelId}
              onChange={(e) => setHostelId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
              placeholder="e.g. 102"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Block Name</label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="e.g. Block A"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              placeholder="e.g. AC / Non-AC / Deluxe"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beds *</label>
            <input
              type="number"
              min="1"
              value={numberOfBeds}
              onChange={(e) => setNumberOfBeds(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Bed ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={costPerBed}
              onChange={(e) => setCostPerBed(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Image</label>
          <div className="flex items-center gap-4 mt-2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/hostel-rooms"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditing ? "Update Room" : "Save Room"}
          </button>
        </div>
      </form>
    </div>
  );
}