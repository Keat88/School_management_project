import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StudentFilters from "../../../components/admin/Studentfilters";
import StudentTable from "../../../components/admin/Studenttable";
import { studentData } from "../../../data/StudentsApi";
import { classRoomApi } from "../../../data/classrooms";
import Pagination from "../../../hooks/Pagination";
import { AlertTriangle, CheckCircle2, AlertCircle, X } from "lucide-react";

function StudentList({ isDark = false }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Filter States
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Data & Pagination States
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Delete Modal & Feedback States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // 1. Debounce Search Value (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset ទៅ Page 1 ពេល Search ពាក្យថ្មី
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // 2. Fetch Students Data ជាមួយ useCallback
  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = {
        search: debouncedSearch,
        gender: genderFilter === "all" ? "" : genderFilter,
        grade: classFilter === "all" ? "" : classFilter,
        per_page: 10,
        page: currentPage,
      };

      const response = await studentData.getAll(queryParams);
      const result = response?.data;

      if (result) {
        setStudents(result?.data || []);

        // Update Pagination Metadata
        if (result.meta) {
          setCurrentPage(result.meta.current_page || 1);
          setTotalPages(result.meta.last_page || 1);
          setTotalItems(result.meta.total || 0);
        }
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, genderFilter, classFilter, currentPage]);

  // 3. Fetch Classes សម្រាប់ Dropdown
  const fetchClass = useCallback(async () => {
    try {
      const response = await classRoomApi.getAll();
      const classData =
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];
      setClasses(Array.isArray(classData) ? classData : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  }, []);

  // Fetch Classes តែម្ដងគត់ពេល Mount
  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  // Fetch Students រាល់ពេល [debouncedSearch, genderFilter, classFilter, currentPage] ផ្លាស់ប្តូរ
  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  // Option Dropdown សម្រាប់ Class Filter
  const classOptions = useMemo(() => {
    if (!Array.isArray(classes)) return [];
    return [
      ...new Set(
        classes.map((c) =>
          c.grade && c.section ? `${c.grade}-${c.section}` : c.name,
        ),
      ),
    ].sort();
  }, [classes]);

  // Handlers សម្រាប់ Filter & Actions
  const handleSearchChange = (val) => {
    setSearchValue(val);
  };

  const handleClassChange = (val) => {
    setClassFilter(val);
    setCurrentPage(1);
  };

  const handleGenderChange = (val) => {
    setGenderFilter(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id) => {
    navigate(`/admin/students/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/students/add/${id}`);
  };

  // Delete Action Triggers Modal
  const handleDeleteClick = (id) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
    setFeedback(null);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentData.delete(studentToDelete);
      setFeedback({
        type: "success",
        text: "Student deleted successfully!",
      });
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudent();
    } catch (error) {
      console.error("Error deleting student:", error);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete student.",
      });
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  return (
    <div className="space-y-6 w-full lg:min-w-160 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            className={`text-lg font-bold dark:text-white tracking-tight ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Students
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Configure school years and active session status.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1  dark:bg-blue-500/10 text-gray-500 dark:text-gray-400 `}
          >
            {totalItems} students found
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold border transition-all animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={18}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="shrink-0 text-rose-600 dark:text-rose-400"
            />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filters Component */}
      <StudentFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        classFilter={classFilter}
        onClassChange={handleClassChange}
        genderFilter={genderFilter}
        onGenderChange={handleGenderChange}
        classOptions={classOptions}
        isDark={isDark}
      />

      {/* Table Component */}
      {loading && students.length === 0 ? (
        <div
          className={`py-12 text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div
              className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
                isDark ? "border-indigo-400" : "border-indigo-300"
              }`}
            ></div>
            <span className="text-sm">Loading student...</span>
          </div>
        </div>
      ) : (
        <StudentTable
          students={students}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
          onView={handleView}
          loading={loading}
          isDark={isDark}
        />
      )}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={10}
        onPageChange={handlePageChange}
        isDark={isDark}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`rounded-lg max-w-sm w-full p-6 shadow-2xl space-y-4 text-center my-auto border transition-all ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold">Delete Student</h3>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Are you sure you want to delete this student record? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-red-500/20 active:scale-95"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
