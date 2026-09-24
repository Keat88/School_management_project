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
import { colorbtn, colorform } from "../../../data/datafeature";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-3 dark:text-slate-100">
        <div className="w-8 h-8 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Loading form details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 w-full mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditing ? "Edit Stay Record" : "Assign Bed to Student"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={18}
              className="shrink-0 text-green-600 dark:text-green-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="shrink-0 text-red-600 dark:text-red-400"
            />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-6"
      >
        {/* Student Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <User size={16} />
            <span>Student Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={colorform.color_label}>Select Student *</label>
              <div className="relative">
                <select
                  value={studentId}
                  onChange={handleStudentSelect}
                  required
                  className={colorform.color_select}
                >
                  <option value="" className="dark:bg-slate-900">
                    Select Student
                  </option>
                  {students.map((st) => (
                    <option
                      key={st.id}
                      value={st.id}
                      className="dark:bg-slate-900"
                    >
                      {st.name || st.student_name} ({st.email || st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={colorform.color_label}>Roll Number *</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                placeholder="e.g. R-101"
                className={colorform.color_input}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-slate-800" />

        {/* Accommodation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <BedDouble size={16} />
            <span>Room & Bed Assignment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={colorform.color_label}>Hostel Room *</label>
              <div className="relative">
                <select
                  value={hostelRoomId}
                  onChange={(e) => setHostelRoomId(e.target.value)}
                  required
                  className={colorform.color_select}
                >
                  <option value="" className="dark:bg-slate-900">
                    Select Room
                  </option>
                  {rooms.map((rm) => (
                    <option
                      key={rm.id}
                      value={rm.id}
                      className="dark:bg-slate-900"
                    >
                      Room #{rm.room_number} ({rm.block_name || rm.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={colorform.color_label}>
                Bed Number / Identifier *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 z-10">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  required
                  placeholder="e.g. B1 or Bed 02"
                  className={`${colorform.color_input} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-slate-800" />

        {/* Duration & Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Calendar size={16} />
            <span>Timeline & Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={colorform.color_label}>Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>
                End Date{" "}
                <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={colorform.color_input}
              />
            </div>
          </div>

          <div>
            <label className={colorform.color_label}>Stay Status *</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${colorform.color_select} capitalize`}
              >
                <option value="active" className="dark:bg-slate-900">
                  Active
                </option>
                <option value="completed" className="dark:bg-slate-900">
                  Completed
                </option>
                <option value="cancelled" className="dark:bg-slate-900">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Save size={16} />
            {loading ? "Saving..." : isEditing ? "Update Stay" : "Assign Bed"}
          </button>
        </div>
      </form>
    </div>
  );
}
