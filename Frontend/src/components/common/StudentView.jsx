import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentData } from "../../data/StudentsApi";

export default function StudentView({ student: propStudent = null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetchedStudent, setFetchedStudent] = useState(null);
  const [loading, setLoading] = useState(!propStudent && Boolean(id));

  const student = propStudent || fetchedStudent;

  useEffect(() => {
    if (!propStudent && id) {
      studentData
        .getShow(id)
        .then((response) => {
          setFetchedStudent(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load student details", error);
          setLoading(false);
        });
    }
  }, [propStudent, id]);

  if (loading) {
    return (
      <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading student details...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-red-500">
        Student not found.
      </div>
    );
  }

  const data = {
    mother_name: student.parent?.mother_name || student.mother_name || "N/A",
    father_name: student.parent?.father_name || student.father_name || "N/A",
    occupation: student.parent?.occupation || student.occupation || "N/A",
    parent_phone: student.parent?.parent_phone || student.parent_phone || "N/A",
    email_parent: student.parent?.email || student.email_parent || "N/A",
    parent_image: student.parent?.parent_image || student.parent_image || null,

    class_id: student.class_id || "N/A",
    address: student.address || "N/A",
    gender: student.gender || "N/A",
    email_student: student.email_student || student.email || "N/A",
    student_name: student.student_name || "N/A",
    date_of_birth: student.date_of_birth || "N/A",
    roll_number: student.roll_number || "N/A",
    student_phone: student.student_phone || "N/A",
    student_image: student.student_image || student.image || null,
  };

  return (
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
            {data.student_image ? (
              <img
                src={data.student_image}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Student Photo</h4>
            <p className="text-xs text-gray-500 mt-0.5">Profile snapshot</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
            {data.parent_image ? (
              <img
                src={data.parent_image}
                alt="Parent"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Parent Photo</h4>
            <p className="text-xs text-gray-500 mt-0.5">Guardian snapshot</p>
          </div>
        </div>
      </div>

      {/* Student Information Section */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Student Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Student Name
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.student_name}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Roll Number
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.roll_number}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Date of Birth
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.date_of_birth}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Gender
            </span>
            <p className="text-gray-800 font-medium mt-1 capitalize">
              {data.gender}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Class ID
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.class_id}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Student Phone
            </span>
            <p className="text-gray-800 font-medium mt-1">
              {data.student_phone}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Student Email
            </span>
            <p className="text-gray-800 font-medium mt-1">
              {data.email_student}
            </p>
          </div>

          <div className="md:col-span-2">
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Address
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.address}</p>
          </div>
        </div>
      </div>

      {/* Parent Information Section */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Parent Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Father Name
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.father_name}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Mother Name
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.mother_name}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Parent Email
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.email_parent}</p>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Parent Phone
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.parent_phone}</p>
          </div>

          <div className="md:col-span-2">
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
              Occupation
            </span>
            <p className="text-gray-800 font-medium mt-1">{data.occupation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}