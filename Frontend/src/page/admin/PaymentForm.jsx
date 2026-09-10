import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, DollarSign } from "lucide-react";

import { studentData } from "../../data/StudentsApi";
import { paymentApi } from "../../data/Payment";

export default function PaymentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    category: "tuition",
    amount: "",
    due_date: "",
    method: "Cash",
    status: "pending",
  });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch students list for dropdown selection
    const fetchStudents = async () => {
      try {
        const res = await studentData.getAll(); // adjust route according to your backend
        const data = res.data?.data || res.data;
        console.log(res.data);
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load students", err);
      }
    };
    fetchStudents();

    if (isEdit && id) {
      const fetchPayment = async () => {
        try {
          const res = await paymentApi.getAll();
          const list = res.data?.data || res.data;
          const current = list.find((p) => p.id === Number(id));
          if (current) {
            setFormData({
              student_id: current.student_id || "",
              category: current.category || "tuition",
              amount: current.amount || "",
              due_date: current.due_date || "",
              method: current.method || "Cash",
              status: current.status || "pending",
            });
          }
        } catch (err) {
          console.error("Failed to load payment details", err);
          setFeedback({
            type: "error",
            text: "Failed to load payment details.",
          });
        }
      };
      fetchPayment();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      if (isEdit) {
        await paymentApi.update(id, formData);
        setFeedback({ type: "success", text: "Payment updated successfully!" });
      } else {
        await paymentApi.create(formData);
        setFeedback({
          type: "success",
          text: "Payment recorded successfully!",
        });
        setFormData({
          student_id: "",
          category: "tuition",
          amount: "",
          due_date: "",
          method: "Cash",
          status: "pending",
        });
      }
      setTimeout(() => navigate(-1), 1200);
    } catch (error) {
      console.error("Submission error details:", error.response?.data);
      const serverErrors = error.response?.data?.errors;
      let errorMessage =
        error.response?.data?.message || "Validation error or server failure.";

      if (serverErrors) {
        const firstKey = Object.keys(serverErrors)[0];
        if (firstKey && serverErrors[firstKey][0]) {
          errorMessage = serverErrors[firstKey][0];
        }
      }

      setFeedback({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl p-6 bg-white border border-gray-200 shadow-sm text-gray-800 font-sans my-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-all cursor-pointer border border-gray-200 mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600" />
            {isEdit ? "Edit Payment Record" : "Record New Payment"}
          </h3>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-5 rounded-xl text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Student
          </label>
          <select
            name="student_id"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
            value={formData.student_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a student...</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_name}{" "}
                {student.class_room
                  ? `- ${student.class_room.grade + student.class_room.section}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Fee Category
            </label>
            <select
              name="category"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all capitalize"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="tuition">Tuition</option>
              <option value="dormitory">Dormitory</option>
              <option value="course">Course</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Amount (US$)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="e.g. 320"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Payment Method
            </label>
            <select
              name="method"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              value={formData.method}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Status
            </label>
            <select
              name="status"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all capitalize"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            {loading ? "Saving..." : isEdit ? "Update Payment" : "Save Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
