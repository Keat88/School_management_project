import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teacherApi } from "../../data/TeacherApi";

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
    if (propTeacher) {
      populateForm(propTeacher);
    } else if (id) {
      teacherApi
        .getShow(id)
        .then((response) => {
          populateForm(response.data);
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading teacher details...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Teacher" : "Add New Teacher"}
      </h2>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
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
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Teacher Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password{" "}
                {isEditMode && (
                  <span className="text-gray-400 font-normal">
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Teacher Code
                </label>
                <input
                  type="text"
                  name="teacher_code"
                  value={formData.teacher_code}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., M.Sc. in Mathematics"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {(imagePreview || existingImage) && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
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
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
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
