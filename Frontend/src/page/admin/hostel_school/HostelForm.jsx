import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { hostelApi } from "../../../data/Hostel";

export default function HostelForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "male",
    address: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const fetchData = async () => {
        try {
          const data = await hostelApi.getShow(id);
          setFormData({
            name: data?.data?.name || data?.name || "",
            type: data?.data?.type || data?.type || "male",
            address: data?.data?.address || data?.address || "",
          });
        } catch (err) {
          console.error("Failed to load building data", err);
          setFeedback({ type: "error", text: "Failed to load building details." });
        }
      };
      fetchData();
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
        const res = await hostelApi.update(id, formData);
        setFeedback({
          type: "success",
          text: res.data?.message || "Dormitory building updated successfully!",
        });
      } else {
        const res = await hostelApi.addNew(formData);
        setFeedback({
          type: "success",
          text: res.data?.message || "Dormitory building created successfully!",
        });
        setFormData({ name: "", type: "male", address: "" });
      }
      setTimeout(() => navigate(-1), 1200);
    } catch (error) {
      console.error("Submission error details:", error.response?.data);
      
      const serverErrors = error.response?.data?.errors;
      let errorMessage = error.response?.data?.message || "Validation error or server failure.";

      if (serverErrors) {
        const firstErrorKey = Object.keys(serverErrors)[0];
        if (firstErrorKey && serverErrors[firstErrorKey][0]) {
          errorMessage = serverErrors[firstErrorKey][0];
        }
      }

      setFeedback({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-w-160 mx-auto rounded-lg p-6 bg-white border border-gray-200 shadow-sm text-gray-800 font-sans my-6 transition-colors duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 dark:text-slate-100">
            <Building2 size={20} className="text-blue-500 dark:text-blue-400" />
            {isEdit ? "Edit Dormitory Building" : "Add New Dormitory Building"}
          </h3>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-5 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
              : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
          }`}
        >
          {feedback.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-slate-400">
            Building Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            placeholder="e.g. Building A - North Wing"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-slate-400">
            Building Type
          </label>
          <select
            name="type"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all capitalize dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-slate-400">
            Address / Location (Optional)
          </label>
          <textarea
            name="address"
            rows="3"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            placeholder="Enter building address or location notes..."
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Save size={14} />{" "}
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Building"
              : "Save Building"}
          </button>
        </div>
      </form>
    </div>
  );
}