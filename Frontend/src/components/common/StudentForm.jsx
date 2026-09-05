import { useState, useEffect } from "react";
import { studentData } from "../../data/StudentsApi";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { classRoomApi } from "../../data/classrooms";

export default function StudentForm({
  student: propStudent = null,
  onSuccess,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentImage, setStudentImage] = useState(null);
  const [imagePreviewStudent, setImagePreviewStudent] = useState(null);
  const [parentImage, setParentImage] = useState(null);
  const [imagePreviewParent, setImagePreviewParent] = useState(null);

  const [fetchedStudent, setFetchedStudent] = useState(null);

  // Support both component prop and route params (`/students/edit/:id`)
  const currentStudent = propStudent || fetchedStudent;
  const activeId = propStudent?.id || id;
  const isEdit = Boolean(activeId);

  const [formData, setFormData] = useState({
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
    roll_number: "",
    student_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [classRoomm, setClassRoom] = useState([]);
  useEffect(() => {
    const fetchClass = async () => {
      const response = await classRoomApi.getAll();
      setClassRoom(response?.data);
    };
    fetchClass();
  }, []);
  useEffect(() => {
    if (!propStudent && id) {
      studentData
        .getShow(id)
        .then((response) => setFetchedStudent(response.data))
        .catch((error) => console.error("Failed to load student data", error));
    }
  }, [propStudent, id]);

  // Populate form fields when student data becomes available
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
        roll_number: currentStudent.roll_number || "",
        student_phone: currentStudent.student_phone || "",
      });
    }
  }, [currentStudent]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentImage(file);
      setImagePreviewStudent(URL.createObjectURL(file));
    }
  };

  const handleImageParentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParentImage(file);
      setImagePreviewParent(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        setTimeout(() => navigate("/students"), 1000);
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
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Student" : "Add New Student"}
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
        {/* Student Information Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Student Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Student Name
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Class ID
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option >--Select class--</option>
                {classRoomm &&
                  classRoomm?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.grade}-{item.section}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Student Phone (Optional)
              </label>
              <input
                type="text"
                name="student_phone"
                value={formData.student_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Student Email
              </label>
              <input
                type="email"
                name="email_student"
                value={formData.email_student}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Student Image
              </label>
              <div className="flex items-center gap-4 mt-2">
                {imagePreviewStudent ? (
                  <img
                    src={imagePreviewStudent}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parent Information Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Parent Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Father Name
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mother Name
              </label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Parent Email
              </label>
              <input
                type="email"
                name="email_parent"
                value={formData.email_parent}
                onChange={handleChange}
              
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Parent Phone
              </label>
              <input
                type="text"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Parent Image
              </label>
              <div className="flex items-center gap-4 mt-2">
                {imagePreviewParent ? (
                  <img
                    src={imagePreviewParent}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageParentChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel Data
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Student" : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
