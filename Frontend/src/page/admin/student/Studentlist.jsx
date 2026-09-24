import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StudentFilters from "../../../components/admin/Studentfilters";
import StudentTable from "../../../components/admin/Studenttable";
import { studentData } from "../../../data/StudentsApi";
import { classRoomApi } from "../../../data/classrooms";
import Pagination from "../../../hooks/Pagination";
import { AlertTriangle, CheckCircle2, AlertCircle, X } from "lucide-react";
import HeaderPage from "../../../hooks/HeaderPage";
import ModalDelete from "../../../hooks/ModalDelete";

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
      <HeaderPage
        title={"Students"}
        description={" Configure school years and active session status."}
        totalItems={totalItems}
        titlefound={"student"}
        feedback={feedback}
      />


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <ModalDelete
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title={"Delete Student"}
            desciption={
              "Are you sure you want to delete this student record? This action cannot be undone."
            }
          />
        </div>
      )}
    </div>
  );
}

export default StudentList;
