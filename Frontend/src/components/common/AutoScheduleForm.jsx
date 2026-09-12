import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate } from "react-router-dom";
import { Wand2, ArrowLeft, Plus, Trash2, Clock, Calendar, BookOpen } from "lucide-react";

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
      { start: "13:30", end: "15:30" }
    ],
  });

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { subject_id: "", teacher_id: "" }]
    }));
  };

  const removeAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...formData.assignments];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, assignments: updated }));
  };

  // Time Slot handlers
  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      time_slots: [...prev.time_slots, { start: "", end: "" }]
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index)
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData(prev => {
      const slots = [...prev.time_slots];
      slots[index][field] = value;
      return { ...prev, time_slots: slots };
    });
  };

  // Day toggle handler
  const toggleDay = (day) => {
    setFormData(prev => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter(d => d !== day) : [...prev.days, day]
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
        text: response.data.message || "Timetable successfully auto-generated!"
      });
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to auto-generate schedule. Check for teacher conflicts."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-w-160 mx-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl text-gray-800 dark:text-slate-100 font-sans my-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all cursor-pointer border border-gray-200 dark:border-slate-700 mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="text-indigo-600 dark:text-indigo-400" size={22} />
            Auto-Generate Weekly Timetable
          </h3>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-5 rounded-xl text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
            Target Class Room
          </label>
          <select
            name="class_id"
            className="w-full px-3.5 py-2.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all"
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            required
          >
            <option value="">Select Class Room</option>
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
              <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" /> Subjects & Assigned Teachers (8-9+ Subjects)
            </label>
            <button
              type="button"
              onClick={addAssignment}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer"
            >
              <Plus size={14} /> Add Subject Pair
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.assignments.map((pair, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={pair.subject_id}
                  onChange={(e) => handleAssignmentChange(index, 'subject_id', e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  onChange={(e) => handleAssignmentChange(index, 'teacher_id', e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
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
                    className="p-2 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 cursor-pointer"
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
            <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" /> Active Days for Schedule Distribution
          </label>
          <div className="flex flex-wrap gap-2">
            {allDays.map((day) => {
              const isSelected = formData.days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
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
              <Clock size={14} className="text-indigo-600 dark:text-indigo-400" /> Daily Time Slots / Periods
            </label>
            <button
              type="button"
              onClick={addTimeSlot}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer"
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
                    onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-gray-400 dark:text-slate-400 text-xs font-medium">to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {formData.time_slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="p-2 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 cursor-pointer"
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
            className="px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-all cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Wand2 size={16} /> {loading ? "Generating Schedule..." : "Auto-Generate Full Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}