import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../../data/api";


export default function StudentStayForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState(null);
  
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Form states mapping your Resource attributes
  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [studentsRes, roomsRes] = await Promise.all([
          api.get("/students"),
          api.get("/hostel-rooms"),
        ]);
        setStudents(studentsRes.data?.data || studentsRes.data || []);
        setRooms(roomsRes.data?.data || roomsRes.data || []);

        if (isEditing) {
          const stayRes = await api.get(`/hostel-student-stays/${id}`);
          const stay = stayRes.data?.data || stayRes.data;
          setStudentId(stay.student_id || stay.student?.id || "");
          setRoomId(stay.room_id || stay.hostel_room_id || "");
          setBedNumber(stay.bed_number || "");
          setStartDate(stay.start_date || "");
          setEndDate(stay.end_date || "");
          setStatus(stay.status || "active");
        }
      } catch (error) {
        setFeedback({ type: "error", text: "Failed to load form dependencies." });
      } finally {
        setFetching(false);
      }
    };
    loadDependencies();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      student_id: studentId,
      room_id: roomId,
      bed_number: bedNumber,
      start_date: startDate,
      end_date: endDate || null,
      status,
    };

    try {
      if (isEditing) {
        await api.put(`/hostel-student-stays/${id}`, payload);
        setFeedback({ type: "success", text: "Stay record updated successfully!" });
      } else {
        await api.post("/hostel-student-stays", payload);
        setFeedback({ type: "success", text: "Student assigned to bed successfully!" });
      }
      setTimeout(() => navigate("/hostel-student-stays"), 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to save record. Please check inputs.",
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
            to="/hostel-student-stays"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Back"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Stay Record" : "Assign Room / Bed to Student"}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Student</option>
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name || st.student_name} ({st.email || st.code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Room *</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room</option>
              {rooms.map((rm) => (
                <option key={rm.id} value={rm.id}>
                  Room #{rm.room_number} ({rm.block_name || rm.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number *</label>
            <input
              type="text"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              required
              placeholder="e.g. B1"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/hostel-student-stays"
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
            {loading ? "Saving..." : isEditing ? "Update Stay" : "Assign Bed"}
          </button>
        </div>
      </form>
    </div>
  );
}