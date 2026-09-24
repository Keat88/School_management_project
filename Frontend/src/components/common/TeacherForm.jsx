import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teacherApi } from "../../data/TeacherApi";
import {
  User,
  Mail,
  Lock,
  Phone,
  Award,
  Hash,
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";

export default function TeacherForm({
  teacher: propTeacher = null,
  onSuccess,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(propTeacher || id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    teacher_code: "",
    qualification: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!propTeacher && Boolean(id));
  const [feedback, setFeedback] = useState(null);
  const teacherId = propTeacher?.id || id;

  useEffect(() => {
    let isMounted = true;

    if (propTeacher) {
      populateForm(propTeacher);
    } else if (id) {
      teacherApi
        .getShow(id)
        .then((response) => {
          if (!isMounted) return;
          populateForm(response.data?.data || response.data);
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error("Failed to load teacher details", error);
          setFeedback({
            type: "error",
            text: "Failed to load teacher details for editing.",
          });
        })
        .finally(() => {
          if (isMounted) setFetching(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [propTeacher, id]);

  const populateForm = (data) => {
    setFormData({
      name: data.name || data.user?.name || "",
      email: data.email || data.user?.email || "",
      password: "",
      gender: data.teacher?.gender || data.gender || "",
      teacher_code: data.teacher?.teacher_code || data.teacher_code || "",
      qualification: data.teacher?.qualification || data.qualification || "",
      phone: data.teacher?.phone || data.phone || "",
    });
    setExistingImage(
      data.teacher?.profile_image || data.user?.profile_image || null,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (isEditMode && key === "password" && !formData[key]) {
        return;
      }
      if (!isEditMode && key === "teacher_code") {
        return;
      }
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ""
      ) {
        data.append(key, formData[key]);
      }
    });

    if (profileImage instanceof File) {
      data.append("profile_image", profileImage);
    }

    if (isEditMode) {
      data.append("_method", "PUT");
    }

    try {
      if (isEditMode) {
        await teacherApi.update(teacherId, data);
        setFeedback({ type: "success", text: "Teacher updated successfully!" });
      } else {
        await teacherApi.addNew(data);
        setFeedback({ type: "success", text: "Teacher added successfully!" });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/admin/teachers"), 1000);
      }
    } catch (error) {
      console.error("Submission Error:", error.response?.data);
      const validationErrors = error.response?.data?.errors;
      let errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please check your inputs.";

      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        errorMessage = validationErrors[firstErrorKey][0];
      }

      setFeedback({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading teacher details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs text-gray-900 dark:text-slate-100 font-sans my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
            {isEditMode ? "Edit Teacher" : "Add New Teacher"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode
              ? "Update teacher account details, credentials, and profile info."
              : "Register a new teacher into the system."}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Teacher Information Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <User size={15} className="text-blue-500 dark:text-blue-400" /> Teacher Credentials & Bio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={colorform.color_label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@example.com"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>
                Password{" "}
                {isEditMode && (
                  <span className="font-normal text-gray-400 dark:text-slate-500 lowercase">
                    (leave blank to keep current)
                  </span>
                )}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                placeholder={isEditMode ? "Optional" : "Min. 8 characters"}
                className={colorform.color_input}
              />
            </div>

            {isEditMode && (
              <div>
                <label className={colorform.color_label}>Teacher Code</label>
                <input
                  type="text"
                  name="teacher_code"
                  value={formData.teacher_code}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-100 dark:bg-slate-950/40 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className={colorform.color_label}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={colorform.color_input}
              >
                <option value="" className="dark:bg-slate-800">Select gender</option>
                <option value="male" className="dark:bg-slate-800">Male</option>
                <option value="female" className="dark:bg-slate-800">Female</option>
                <option value="other" className="dark:bg-slate-800">Other</option>
              </select>
            </div>

            <div>
              <label className={colorform.color_label}>Qualification *</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., M.Sc. in Computer Science"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+855 12 345 678"
                className={colorform.color_input}
              />
            </div>

            <div className="md:col-span-2">
              <label className={colorform.color_label}>Profile Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {(imagePreview || existingImage) && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shrink-0 bg-gray-100 dark:bg-slate-950 shadow-xs">
                    <img
                      src={imagePreview || existingImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setProfileImage(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full transition cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}

                <label className="flex-1 w-full flex flex-col items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-300">
                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Choose profile image file (JPG, PNG)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={colorbtn.btnsave}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Teacher"
              : "Save Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
}