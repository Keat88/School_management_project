import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { hostelApi } from "../../../data/Hostel";
import { colorbtn, colorform } from "../../../data/datafeature";

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
          setFeedback({
            type: "error",
            text: "Failed to load building details.",
          });
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
      let errorMessage =
        error.response?.data?.message || "Validation error or server failure.";

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
    <div className ={colorform.body_form} >
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
          <label className={colorform.color_label}>
            Building Name
          </label>
          <input
            type="text"
            name="name"
            className={colorform.color_input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className={colorform.color_label}>
            Building Type
          </label>
          <select
            name="type"
            className={colorform.color_select}
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
          <label className={colorform.color_label}>
            Address / Location (Optional)
          </label>
          <textarea
            name="address"
            rows="3"
            className={colorform.color_input}
            placeholder="Enter building address or location notes..."
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button type="button" className={colorbtn.btncancel}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
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
