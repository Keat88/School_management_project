import { useState, useEffect, useCallback } from "react";
import { studentData } from "../../data/StudentsApi";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { classRoomApi } from "../../data/classrooms";

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

export default function StudentForm({
  student: propStudent = null,
  onSuccess,
  isDark = false,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentImage, setStudentImage] = useState(null);
  const [imagePreviewStudent, setImagePreviewStudent] = useState(null);
  const [parentImage, setParentImage] = useState(null);
  const [imagePreviewParent, setImagePreviewParent] = useState(null);

  const [fetchedStudent, setFetchedStudent] = useState(null);
  const currentStudent = propStudent || fetchedStudent;
  const activeId = propStudent?.id || id;
  const isEdit = Boolean(activeId);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [classRoomm, setClassRoom] = useState([]);

  // Fetch Classrooms
  const fetchClass = useCallback(async () => {
    try {
      const response = await classRoomApi.getAll();
      const classData =
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];
      setClassRoom(Array.isArray(classData) ? classData : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClassRoom([]);
    }
  }, []);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  // Fetch student details if ID is present and no prop passed
  useEffect(() => {
    if (!propStudent && id) {
      setFetchingStudent(true);
      studentData
        .getShow(id)
        .then((response) => {
          const studentRes = response?.data?.data || response?.data;
          setFetchedStudent(studentRes);
        })
        .catch((error) => console.error("Failed to load student data", error))
        .finally(() => setFetchingStudent(false));
    }
  }, [propStudent, id]);

  // Populate Form Fields
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

  // Image Handlers with URL memory leak prevention
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewStudent((prevUrl) => {
        if (prevUrl?.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
        return objectUrl;
      });
    }
  };

  const handleImageParentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParentImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewParent((prevUrl) => {
        if (prevUrl?.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
        return objectUrl;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    if (parentImage instanceof File) {
      data.append("parent_image", parentImage);
    }
    if (studentImage instanceof File) {
      data.append("student_image", studentImage);
    }

    if (isEdit) {
      data.append("_method", "PUT");
    }

    try {
      if (isEdit) {
        await studentData.upDate(activeId, data);
        setFeedback({ type: "success", text: "Student updated successfully!" });
      } else {
        await studentData.addNew(data);
        setFeedback({ type: "success", text: "Student added successfully!" });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/admin/students"), 1000);
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

  return (
    <>
      {fetchingStudent && (
        <div className={`py-12 text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
              isDark ? "border-indigo-400" : "border-indigo-300"
            }`}></div>
            <span>Loading student...</span>
          </div>
        </div>
      )}

      <div className={`mx-auto p-6 rounded-xl border transition-colors ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-200 text-gray-800"
      }`}>
        <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
          {isEdit ? "Edit Student" : "Add New Student"}
        </h2>

        {feedback && (
          <div
            className={`p-4 mb-6 rounded-lg text-sm font-medium border ${
              feedback.type === "success"
                ? isDark
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-green-50 text-green-600 border-green-200"
                : isDark
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-red-50 text-red-600 border-red-200"
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
          {/* Student Information Section */}
          <div>
            <h3 className={`text-md font-semibold mb-4 pb-2 border-b ${
              isDark ? "text-slate-200 border-slate-800" : "text-gray-700 border-gray-100"
            }`}>
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Student Name
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              {/* Read-only Roll Number field displayed ONLY in Edit mode */}
              {isEdit && currentStudent?.roll_number && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={currentStudent.roll_number}
                    disabled
                    className={`w-full px-3 py-2 border rounded-lg text-sm cursor-not-allowed ${
                      isDark
                        ? "bg-slate-800/50 border-slate-800 text-slate-500"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                    }`}
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Class Room
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <option value="">--Select class--</option>
                  {classRoomm.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.grade && item.section
                        ? `${item.grade}-${item.section}`
                        : item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Student Phone (Optional)
                </label>
                <input
                  type="text"
                  name="student_phone"
                  value={formData.student_phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Student Email
                </label>
                <input
                  type="email"
                  name="email_student"
                  value={formData.email_student}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Address
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                ></textarea>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Student Image
                </label>
                <div className="flex items-center gap-4 mt-2">
                  {imagePreviewStudent ? (
                    <img
                      src={imagePreviewStudent}
                      alt="Student Preview"
                      className={`w-16 h-16 rounded-lg object-cover border shrink-0 ${
                        isDark ? "border-slate-700" : "border-gray-200"
                      }`}
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-lg border flex items-center justify-center shrink-0 ${
                      isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    className={`w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                      isDark
                        ? "text-slate-400 file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                        : "text-gray-500 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
          <div>
            <h3 className={`text-md font-semibold mb-4 pb-2 border-b ${
              isDark ? "text-slate-200 border-slate-800" : "text-gray-700 border-gray-100"
            }`}>
              Parent Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Father Name
                </label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Mother Name
                </label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Parent Email
                </label>
                <input
                  type="email"
                  name="email_parent"
                  value={formData.email_parent}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Parent Phone
                </label>
                <input
                  type="text"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Parent Image
                </label>
                <div className="flex items-center gap-4 mt-2">
                  {imagePreviewParent ? (
                    <img
                      src={imagePreviewParent}
                      alt="Parent Preview"
                      className={`w-16 h-16 rounded-lg object-cover border shrink-0 ${
                        isDark ? "border-slate-700" : "border-gray-200"
                      }`}
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-lg border flex items-center justify-center shrink-0 ${
                      isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageParentChange}
                    className={`w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                      isDark
                        ? "text-slate-400 file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                        : "text-gray-500 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50 ${
                isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Student"
                  : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}