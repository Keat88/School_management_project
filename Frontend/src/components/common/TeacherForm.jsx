import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teacherApi } from "../../data/TeacherApi";

export default function TeacherForm({ teacher: propTeacher = null, onSuccess }) {
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
    if (propTeacher) {
      populateForm(propTeacher);
    } else if (id) {
      teacherApi
        .getShow(id)
        .then((response) => {
          populateForm(response.data?.data || response.data);
          setFetching(false);
        })
        .catch((error) => {
          console.error("Failed to load teacher details", error);
          setFetching(false);
          setFeedback({
            type: "error",
            text: "Failed to load teacher details for editing.",
          });
        });
    }
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
      <div className="max-w-4xl mx-auto p-6 rounded-2xl border shadow-sm text-center bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 transition-colors">
        Loading teacher details...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto p-8 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 transition-colors">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-slate-100">
        {isEditMode ? "Edit Teacher" : "Add New Teacher"}
      </h2>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div>
          <h3 className="text-md font-semibold mb-4 pb-2 border-b text-gray-700 dark:text-slate-200 border-gray-100 dark:border-slate-800">
            Teacher Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Password{" "}
                {isEditMode && (
                  <span className="font-normal text-gray-400 dark:text-slate-500">
                    (Leave blank to keep current)
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
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                  Teacher Code
                </label>
                <input
                  type="text"
                  name="teacher_code"
                  value={formData.teacher_code}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">Select gender</option>
                <option value="male" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">Male</option>
                <option value="female" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">Female</option>
                <option value="other" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., M.Sc. in Mathematics"
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-950/60 border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-slate-300">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {(imagePreview || existingImage) && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border flex-shrink-0 border-gray-200 dark:border-slate-700 shadow-sm">
                    <img
                      src={imagePreview || existingImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-indigo-500/20 file:text-blue-600 dark:file:text-indigo-300 hover:file:bg-blue-100 dark:hover:file:bg-indigo-500/30 cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
          >
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