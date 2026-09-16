import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StudentFilters from "../../../components/admin/Studentfilters";
import StudentTable from "../../../components/admin/Studenttable";
import { studentData } from "../../../data/StudentsApi";
import { classRoomApi } from "../../../data/classrooms";
import Pagination from "../../../hooks/Pagination";

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

  const handleDelete = async (id) => {
    try {
      await studentData.delete(id);
      fetchStudent();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="space-y-6 w-full lg:min-w-160 mx-auto ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            className={`text-lg  font-bold tracking-tight ${isDark ? "text-slate-100" : "text-gray-800"}`}
          >
            Students
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Configure school years and active session status.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20`}
          >
            {totalItems} students found
          </span>
        </div>
      </div>

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
          onDelete={handleDelete}
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
    </div>
  );
}

export default StudentList;
