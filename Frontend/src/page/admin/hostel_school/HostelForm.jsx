import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import api from "../../data/api";

export default function HostelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [feedback, setFeedback] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchHostel = async () => {
        try {
          const response = await api.get(`/hostels/${id}`);
          const hostel = response.data?.data || response.data;
          setName(hostel.name || "");
          setType(hostel.type || "");
          setAddress(hostel.address || "");
        } catch (error) {
          setFeedback({
            type: "error",
            text: "Failed to load hostel data for editing.",
          });
        } finally {
          setFetching(false);
        }
      };
      fetchHostel();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = { name, type, address };

    try {
      if (isEditing) {
        await api.put(`/hostels/${id}`, payload);
        setFeedback({ type: "success", text: "Hostel updated successfully!" });
      } else {
        await api.post("/hostels", payload);
        setFeedback({ type: "success", text: "Hostel created successfully!" });
      }
      setTimeout(() => {
        navigate("/hostel");
      }, 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save hostel. Please check inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-gray-400 text-sm">
        Loading hostel details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/hostel"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Back to Hostels"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Hostel" : "Add New Hostel"}
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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hostel Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Alpha Boys Hostel"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hostel Type *
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            placeholder="e.g. Boys, Girls, Mixed"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            placeholder="Enter complete address..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/hostel"
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
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Hostel"
                : "Save Hostel"}
          </button>
        </div>
      </form>
    </div>
  );
}
