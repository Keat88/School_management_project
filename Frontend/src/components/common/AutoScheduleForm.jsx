import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate } from "react-router-dom";
import { Wand2, Plus, Trash2, Clock, Calendar, BookOpen } from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";

export default function AutoScheduleForm() {
  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState({
    classes: [],
    subjects: [],
    teachers: [],
  });
  const [formData, setFormData] = useState({
    class_id: "",
    assignments: [{ subject_id: "", teacher_id: "" }],
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    time_slots: [
      { start: "08:00", end: "10:00" },
      { start: "10:15", end: "12:15" },
      { start: "13:30", end: "15:30" },
    ],
  });

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const result = await api.get("/form-schedult");
      const data = result.data?.data || result.data;
      if (data) {
        setDropdowns({
          classes: data?.class || [],
          subjects: data?.subject || [],
          teachers: data?.teacher || [],
        });
      }
    } catch (error) {
      console.error("Failed to load form dropdowns", error);
    }
  };

  // Assignment handlers (Subjects & Teachers)
  const addAssignment = () => {
    setFormData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { subject_id: "", teacher_id: "" }],
    }));
  };

  const removeAssignment = (index) => {
    setFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index),
    }));
  };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...formData.assignments];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, assignments: updated }));
  };

  // Time Slot handlers
  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      time_slots: [...prev.time_slots, { start: "", end: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index),
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData((prev) => {
      const slots = [...prev.time_slots];
      slots[index][field] = value;
      return { ...prev, time_slots: slots };
    });
  };

  // Day toggle handler
  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter((d) => d !== day) : [...prev.days, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const response = await api.post("/timetable/auto-generate", formData);
      setFeedback({
        type: "success",
        text: response.data.message || "Timetable successfully auto-generated!",
      });
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to auto-generate schedule. Check for teacher conflicts.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs text-gray-900 dark:text-slate-100 font-sans my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wand2 className="text-blue-500 dark:text-blue-400" size={22} />
            Auto-Generate Weekly Timetable
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Automatically distribute subjects across active days and time slots
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Selection */}
        <div>
          <label className={colorform.color_label}>Target Class Room *</label>
          <select
            name="class_id"
            className={colorform.color_input}
            value={formData.class_id}
            onChange={(e) =>
              setFormData({ ...formData, class_id: e.target.value })
            }
            required
          >
            <option value="">-- Choose a Class Room --</option>
            {dropdowns.classes.map((cls) => (
              <option key={cls.id_class} value={cls.id_class}>
                {cls.name_class}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects & Teachers Pairs */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen
                size={14}
                className="text-blue-500 dark:text-blue-400"
              />{" "}
              Subjects & Assigned Teachers
            </label>
            <button
              type="button"
              onClick={addAssignment}
              className={colorbtn.btnadd}
            >
              <Plus size={14} /> Add Subject
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.assignments.map((pair, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={pair.subject_id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "subject_id", e.target.value)
                  }
                  required
                  className={colorform.color_input}
                >
                  <option value="">Select Subject {index + 1}</option>
                  {dropdowns.subjects.map((sub) => (
                    <option key={sub.id_subject} value={sub.id_subject}>
                      {sub.name_subject}
                    </option>
                  ))}
                </select>

                <select
                  value={pair.teacher_id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "teacher_id", e.target.value)
                  }
                  required
                  className={colorform.color_input}
                >
                  <option value="">Select Teacher</option>
                  {dropdowns.teachers.map((t) => (
                    <option key={t.id_teacher} value={t.id_teacher}>
                      {t.name_teacher}
                    </option>
                  ))}
                </select>

                {formData.assignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssignment(index)}
                    className={colorbtn.btndelete}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Days of the Week Selection */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-500 dark:text-blue-400" />{" "}
            Active Days for Schedule Distribution
          </label>
          <div className="flex flex-wrap gap-2">
            {allDays.map((day) => {
              const isSelected = formData.days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Setup */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500 dark:text-blue-400" />{" "}
              Daily Time Slots / Periods
            </label>
            <button
              type="button"
              onClick={addTimeSlot}
              className="inline-flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Plus size={14} /> Add Time Slot
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.time_slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "start", e.target.value)
                    }
                    required
                    className={colorform.color_input}
                  />
                  <span className="text-gray-400 dark:text-slate-400 text-xs font-medium shrink-0">
                    to
                  </span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "end", e.target.value)
                    }
                    required
                    className={colorform.color_input}
                  />
                </div>

                {formData.time_slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className={colorbtn.btndelete}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Wand2 size={16} />
            {loading ? "Generating Schedule..." : "Auto-Generate Full Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
