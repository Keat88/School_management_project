import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  BedDouble,
  Calendar,
  Activity,
  Hash,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../data/api";
import { AddStudentHostelApi, hostelRoomApi } from "../../../data/Hostel";
import { studentData } from "../../../data/StudentsApi";

export default function StudentStayForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Form states
  const [studentId, setStudentId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [hostelRoomId, setHostelRoomId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [studentsRes, roomsRes] = await Promise.all([
          studentData.getAll(),
          hostelRoomApi.getAll(),
        ]);
        const fetchedStudents =
          studentsRes.data?.data || studentsRes.data || [];
        const fetchedRooms = roomsRes.data?.data || roomsRes.data || [];
        setStudents(fetchedStudents);
        setRooms(fetchedRooms);

        if (isEditing) {
          const stayRes = await AddStudentHostelApi.getShow(id);
          const stay = stayRes.data?.data || stayRes.data;

          setStudentId(stay.student_id || stay.student?.id || "");
          setRollNumber(stay.roll_number || stay.student?.roll_number || "");
          setHostelRoomId(stay.hostel_room_id || stay.room_id || "");
          setBedNumber(stay.bed_number || "");
          setStartDate(stay.start_date || "");
          setEndDate(stay.end_date || "");
          setStatus(stay.status || "active");
        }
      } catch (error) {
        setFeedback({
          type: "error",
          text: "Failed to load form dependencies.",
        });
      } finally {
        setFetching(false);
      }
    };
    loadDependencies();
  }, [id, isEditing]);

  // Sync selected student ID and populate corresponding roll number
  const handleStudentSelect = (e) => {
    const selectedId = e.target.value;
    setStudentId(selectedId);

    const selectedStudent = students.find(
      (st) => String(st.id) === String(selectedId),
    );

    if (selectedStudent) {
      setRollNumber(
        selectedStudent.roll_number ||
          selectedStudent.roll_no ||
          selectedStudent.code ||
          "",
      );
    } else {
      setRollNumber("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // Payload mapped to backend validation schema
    const payload = {
      student_id: studentId,
      roll_number: rollNumber,
      hostel_room_id: hostelRoomId,
      bed_number: bedNumber,
      start_date: startDate,
      end_date: endDate || null,
      status,
    };

    try {
      if (isEditing) {
        await AddStudentHostelApi.upDate(id, payload);
        setFeedback({
          type: "success",
          text: "Stay record updated successfully!",
        });
      } else {
        await AddStudentHostelApi.addNew(payload);
        setFeedback({
          type: "success",
          text: "Student assigned to bed successfully!",
        });
      }
      setTimeout(() => navigate("/admin/hostel-stays"), 1000);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const errorMsg = apiErrors
        ? Object.values(apiErrors).flat().join(" ")
        : error.response?.data?.message ||
          "Failed to save record. Please check inputs.";

      setFeedback({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">
          Loading form details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="p-2.5 border border-gray-200 bg-white rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-xs transition-all shrink-0"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Stay Record" : "Assign Bed to Student"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {isEditing
                ? "Modify existing hostel assignment and timeline"
                : "Allocate room, bed number, and duration for a student"}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0 text-green-600" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6"
      >
        {/* Student Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <User size={16} />
            <span>Student Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Student *
              </label>
              <div className="relative">
                <select
                  value={studentId}
                  onChange={handleStudentSelect}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none"
                >
                  <option value="">Select Student</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name || st.student_name} ({st.email || st.code})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Roll Number *
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                placeholder="e.g. R-101"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Accommodation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <BedDouble size={16} />
            <span>Room & Bed Assignment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hostel Room *
              </label>
              <div className="relative">
                <select
                  value={hostelRoomId}
                  onChange={(e) => setHostelRoomId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none"
                >
                  <option value="">Select Room</option>
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      Room #{rm.room_number} ({rm.block_name || rm.type})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bed Number / Identifier *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  required
                  placeholder="e.g. B1 or Bed 02"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Duration & Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Calendar size={16} />
            <span>Timeline & Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Stay Status *
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all capitalize appearance-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 text-center transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditing ? "Update Stay" : "Assign Bed"}
          </button>
        </div>
      </form>
    </div>
  );
}
