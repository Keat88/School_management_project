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

  // Reusable Tailwind class styles to eliminate repetitive inline code
  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-600 dark:focus:border-blue-500";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300";

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading teacher detail ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto space-y-6 p-6 sm:p-8  border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
              <Users className="text-blue-500 dark:text-blue-400" size={22} />
              {isEditMode ? "Edit Teacher" : "Add New Teacher"}
            </h2>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {isEditMode
                ? "Update teacher account details, credentials, and profile info."
                : "Enter the profile details below to register a new teacher."}
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : "bg-red-50 dark:bg-rose-500/10 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-500/20"
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
        className="space-y-8"
        encType="multipart/form-data"
      >
        {/* Section: Teacher Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <User size={16} /> Teacher Credentials & Bio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Password{" "}
                {isEditMode && (
                  <span className="font-normal text-slate-400 dark:text-slate-500 lowercase">
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
                className={inputClass}
              />
            </div>

            {isEditMode && (
              <div>
                <label className={labelClass}>Teacher Code</label>
                <input
                  type="text"
                  name="teacher_code"
                  value={formData.teacher_code}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Qualification *</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., M.Sc. in Computer Science"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+855 12 345 678"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Profile Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {(imagePreview || existingImage) && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-950 shadow-2xs">
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
                        className="absolute top-1 right-1 p-0.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                )}

                <label className="flex-1 w-full flex flex-col items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-950/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
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

        {/* Footer Actions */}
        <div className="pt-6 border-t flex items-center justify-end gap-3 border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
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
