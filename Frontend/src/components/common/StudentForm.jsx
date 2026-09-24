import { useState, useEffect } from "react";
import { studentData } from "../../data/StudentsApi";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon, AlertCircle, User, Users, Save } from "lucide-react";
import { api } from "../../data/api";
import { colorbtn, colorform } from "../../data/datafeature";

const INITIAL_FORM_STATE = {
  mother_name: "",
  father_name: "",
  occupation: "",
  parent_phone: "",
  class_id: "",
  address: "",
  gender: "male",
  email_student: "",
  email_parent: "",
  student_name: "",
  date_of_birth: "",
  student_phone: "",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function StudentForm({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentImage, setStudentImage] = useState(null);
  const [imagePreviewStudent, setImagePreviewStudent] = useState(null);
  const [parentImage, setParentImage] = useState(null);
  const [imagePreviewParent, setImagePreviewParent] = useState(null);
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentStudent, setCurrentStudent] = useState([]);
  const [classFilter, setClassFilter] = useState([]);

  useEffect(() => {
    return () => {
      if (imagePreviewStudent?.startsWith("blob:"))
        URL.revokeObjectURL(imagePreviewStudent);
      if (imagePreviewParent?.startsWith("blob:"))
        URL.revokeObjectURL(imagePreviewParent);
    };
  }, [imagePreviewStudent, imagePreviewParent]);

  useEffect(() => {
    if (isEdit) {
      const fetchCurrentStudent = async () => {
        try {
          setLoading(true);
          const res = await studentData.getShow(id);
          const data = res?.data || res?.data?.data || res;
          setCurrentStudent(data);
        } catch (error) {
          console.error("Error fetching student", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCurrentStudent();
    }
  }, [id, isEdit]);

  useEffect(() => {
    const fetchClassFilter = async () => {
      try {
        const res = await api.get("/class-activeform");
        const data = res?.data?.data || res?.data || res;
        setClassFilter(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching classes", err);
      }
    };
    fetchClassFilter();
  }, []);

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        mother_name:
          currentStudent.parent?.mother_name ||
          currentStudent.mother_name ||
          "",
        father_name:
          currentStudent.parent?.father_name ||
          currentStudent.father_name ||
          "",
        occupation:
          currentStudent.parent?.occupation || currentStudent.occupation || "",
        parent_phone:
          currentStudent.parent?.parent_phone ||
          currentStudent.parent_phone ||
          "",
        email_parent:
          currentStudent.parent?.email || currentStudent.email_parent || "",
        class_id: currentStudent.class_id || "",
        address: currentStudent.address || "",
        gender: currentStudent.gender || "male",
        email_student:
          currentStudent.email_student || currentStudent.email || "",
        student_name: currentStudent.student_name || "",
        date_of_birth: currentStudent.date_of_birth || "",
        student_phone: currentStudent.student_phone || "",
      });

      if (currentStudent.student_image) {
        setImagePreviewStudent(currentStudent.student_image);
      }
      if (currentStudent.parent?.parent_image || currentStudent.parent_image) {
        setImagePreviewParent(
          currentStudent.parent?.parent_image || currentStudent.parent_image,
        );
      }
    } else {
      setFormData(INITIAL_FORM_STATE);
      setImagePreviewStudent(null);
      setImagePreviewParent(null);
    }
  }, [currentStudent]);

  const handleImageValidation = (file, setImage, setPreview) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFeedback({
        type: "error",
        text: "Image file is too large. Max size is 2MB.",
      });
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview((prevUrl) => {
      if (prevUrl?.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
      return objectUrl;
    });
    setFeedback(null);
  };

  const handleImageChange = (e) => {
    handleImageValidation(
      e.target.files[0],
      setStudentImage,
      setImagePreviewStudent,
    );
  };

  const handleImageParentChange = (e) => {
    handleImageValidation(
      e.target.files[0],
      setParentImage,
      setImagePreviewParent,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        formDataObj.append(key, formData[key]);
      }
    });
    if (parentImage instanceof File) {
      formDataObj.append("parent_image", parentImage);
    }
    if (studentImage instanceof File) {
      formDataObj.append("student_image", studentImage);
    }
    if (isEdit) {
      formDataObj.append("_method", "PUT");
    }

    try {
      if (isEdit) {
        const res = await studentData.upDate(id, formDataObj);
        const responseData = res?.data || res?.data?.data || res;
        if (responseData) {
          setFeedback({
            type: "success",
            text: responseData.message || "Student updated successfully!",
          });
        }
      } else {
        const res = await studentData.addNew(formDataObj);
        const responseData = res?.data || res?.data?.data || res;
        if (responseData) {
          setFeedback({
            type: "success",
            text: responseData.message || "Student created successfully!",
          });
        }
      }
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate("/admin/students");
        }, 1000);
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentStudent.student_name && isEdit) {
    return (
      <div className="py-12 min-h-screen flex justify-center items-center text-center text-gray-500 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-500 dark:border-indigo-400"></div>
          <span>Loading student...</span>
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
              <User size={20} />
            </div>
            {isEdit ? "Edit Student Profile" : "Add New Student"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEdit
              ? "Modify existing student and parent credentials."
              : "Register a new student into the system."}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2.5 shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {feedback.type === "error" && (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Student Information Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <User size={15} className="text-blue-500 dark:text-blue-400" />{" "}
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={colorform.color_label}>Student Name *</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className={colorform.color_input}
              />
            </div>

            {isEdit && currentStudent?.roll_number && (
              <div>
                <label className={colorform.color_label}>Roll Number</label>
                <input
                  type="text"
                  value={currentStudent.roll_number}
                  disabled
                  className={`${colorform.color_input} cursor-not-allowed bg-gray-100 dark:bg-slate-800/40 opacity-70`}
                />
              </div>
            )}

            <div>
              <label className={colorform.color_label}>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className={`${colorform.color_input} dark:[color-scheme:dark]`}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={colorform.color_input}
              >
                <option value="male" className="dark:bg-slate-800">
                  Male
                </option>
                <option value="female" className="dark:bg-slate-800">
                  Female
                </option>
                <option value="other" className="dark:bg-slate-800">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className={colorform.color_label}>Class Room *</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="" className="dark:bg-slate-800">
                  -- Select Class --
                </option>
                {classFilter.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="dark:bg-slate-800"
                  >
                    {item.grade && item.section
                      ? `${item.grade}-${item.section}`
                      : item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={colorform.color_label}>
                Student Phone{" "}
                <span className="font-normal opacity-70">(Optional)</span>
              </label>
              <input
                type="text"
                name="student_phone"
                value={formData.student_phone}
                onChange={handleChange}
                placeholder="e.g. +123456789"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Student Email *</label>
              <input
                type="email"
                name="email_student"
                value={formData.email_student}
                onChange={handleChange}
                required
                placeholder="student@example.com"
                className={colorform.color_input}
              />
            </div>

            <div className="md:col-span-2">
              <label className={colorform.color_label}>Address *</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter full address"
                className={colorform.color_input}
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className={colorform.color_label}>Student Image</label>
              <div className="flex items-center gap-4 mt-2">
                {imagePreviewStudent ? (
                  <img
                    src={imagePreviewStudent}
                    alt="Student Preview"
                    className="w-16 h-16 rounded-xl object-cover border shadow-xs shrink-0 border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl border flex items-center justify-center shrink-0 shadow-xs bg-gray-50 border-gray-200 text-gray-400 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-500">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="w-full text-sm cursor-pointer text-gray-600 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/20 dark:file:text-blue-300 dark:hover:file:bg-blue-500/30 file:transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parent Information Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <Users size={15} className="text-blue-500 dark:text-blue-400" />{" "}
            Parent Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={colorform.color_label}>Father Name *</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                required
                placeholder="Father's full name"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Mother Name *</label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                required
                placeholder="Mother's full name"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Parent Email</label>
              <input
                type="email"
                name="email_parent"
                value={formData.email_parent}
                onChange={handleChange}
                placeholder="parent@example.com"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Parent Phone *</label>
              <input
                type="text"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                required
                placeholder="e.g. +123456789"
                className={colorform.color_input}
              />
            </div>

            <div className="md:col-span-2">
              <label className={colorform.color_label}>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Parent's occupation"
                className={colorform.color_input}
              />
            </div>

            <div className="md:col-span-2">
              <label className={colorform.color_label}>Parent Image</label>
              <div className="flex items-center gap-4 mt-2">
                {imagePreviewParent ? (
                  <img
                    src={imagePreviewParent}
                    alt="Parent Preview"
                    className="w-16 h-16 rounded-xl object-cover border shadow-xs shrink-0 border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl border flex items-center justify-center shrink-0 shadow-xs bg-gray-50 border-gray-200 text-gray-400 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-500">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageParentChange}
                  className="w-full text-sm cursor-pointer text-gray-600 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/20 dark:file:text-blue-300 dark:hover:file:bg-blue-500/30 file:transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Save size={16} />
            {loading ? "Saving..." : isEdit ? "Update Student" : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
