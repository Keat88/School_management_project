import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentData } from "../../data/StudentsApi";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const isMounted = useRef(true);
  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);
  useEffect(() => {
    const studentViewFetch = async () => {
      try {
        setLoading(true);
        const response = await studentData.getShow(id);
        const data = response?.data || response?.data?.data || response;
        setStudent(data);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    };
    // if (!propStudent && id) {
    //   studentData
    //     .getShow(id)
    //     .then((response) => {
    //       if (isMounted.current) {
    //         setFetchedStudent(response.data?.data || response.data);
    //         setLoading(false);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Failed to load student details", error);
    //       if (isMounted.current) {
    //         setLoading(false);
    //       }
    //     });
    // }
    studentViewFetch();
  }, [id]);;
 if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto p-6 rounded-xl border shadow-sm text-center bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-red-500 dark:text-red-400">
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

    class_id: student.class?.name || student.class_id || "N/A",
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
    <div className="lg:min-w-160 mx-auto p-6 rounded-lg border space-y-6 transition-colors bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
          Student Details
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700"
        >
          Back
        </button>
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4 p-4 rounded-xl border bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border bg-gray-200 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            {data.student_image ? (
              <img
                src={data.student_image}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                No Image
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">
              Student Photo
            </h4>
            <p className="text-xs mt-0.5 text-gray-500 dark:text-slate-400">
              Profile snapshot
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-xl border bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border bg-gray-200 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            {data.parent_image ? (
              <img
                src={data.parent_image}
                alt="Parent"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                No Image
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">
              Parent Photo
            </h4>
            <p className="text-xs mt-0.5 text-gray-500 dark:text-slate-400">
              Guardian snapshot
            </p>
          </div>
        </div>
      </div>

      {/* Student Information Section */}
      <div>
        <h3 className="text-md font-semibold mb-4 pb-2 border-b text-gray-700 dark:text-slate-200 border-gray-100 dark:border-slate-800">
          Student Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Student Name
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.student_name}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Roll Number
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.roll_number}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Date of Birth
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.date_of_birth}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Gender
            </span>
            <p className="font-medium mt-1 capitalize text-gray-800 dark:text-slate-200">
              {data.gender}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Class
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.class_id}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Student Phone
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.student_phone}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Student Email
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.email_student}
            </p>
          </div>

          <div className="md:col-span-2">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Address
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.address}
            </p>
          </div>
        </div>
      </div>

      {/* Parent Information Section */}
      <div>
        <h3 className="text-md font-semibold mb-4 pb-2 border-b text-gray-700 dark:text-slate-200 border-gray-100 dark:border-slate-800">
          Parent Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Father Name
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.father_name}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Mother Name
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.mother_name}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Parent Email
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.email_parent}
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Parent Phone
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.parent_phone}
            </p>
          </div>

          <div className="md:col-span-2">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
              Occupation
            </span>
            <p className="font-medium mt-1 text-gray-800 dark:text-slate-200">
              {data.occupation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
