import { useCallback, useEffect, useState } from "react";
import TeacherFilters from "../../../components/admin/Teacherfilters";
import TeacherTable from "../teacher/Teachertable";
import { teacherApi } from "../../../data/TeacherApi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../hooks/Pagination";

function TeacherList({ isDark = true }) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle gender dropdown changes and reset page
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setCurrentPage(1);
  };

  // 2. Fetch Teachers Data
  const fetchTeacher = useCallback(
    async (query = "", genderFilter = "", page = 1) => {
      try {
        setLoading(true);
        const response = await teacherApi.getAll({
          search: query,
          gender: genderFilter,
          per_page: 10,
          page: page,
        });

        const result = response?.data;

        if (result) {
          setTeachers(Array.isArray(result.data) ? result.data : []);

          if (result.meta) {
            setCurrentPage(result.meta.current_page || 1);
            setTotalPages(result.meta.last_page || 1);
            setTotalItems(result.meta.total || 0);
          } else if (result.last_page) {
            setCurrentPage(result.current_page || 1);
            setTotalPages(result.last_page || 1);
            setTotalItems(result.total || 0);
          }
        } else {
          setTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 3. Trigger API call when debounced search term, gender, or current page changes
  useEffect(() => {
    fetchTeacher(debouncedSearch, gender, currentPage);
  }, [debouncedSearch, gender, currentPage, fetchTeacher]);

  const handleEdit = (id) => {
    navigate(`/admin/teacher/add/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      await teacherApi.delete(id);
      fetchTeacher(debouncedSearch, gender, currentPage);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            Teachers
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Manage and view teacher records
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isDark ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-indigo-50 text-indigo-700"
        }`}>
          Total: {totalItems}
        </span>
      </div>

      {/* Search Filter Component */}
      <TeacherFilters
        searchValue={searchValue}
        genderValue={gender}
        onSearchChange={setSearchValue}
        onGenderChange={handleGenderChange}
        isDark={isDark}
      />

      {/* Table Container with dynamic loading overlay/state */}
      <div className={`border rounded-2xl p-5 shadow-sm space-y-4 min-h-[300px] relative transition-all ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}>
        {loading && (
          <div className={`absolute inset-0 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-xl transition-all ${
            isDark ? "bg-slate-950/70" : "bg-white/80"
          }`}>
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className={`text-xs font-medium mt-2 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Loading page...
            </span>
          </div>
        )}

        <TeacherTable
          teachers={teachers}
          onDeleteId={handleDelete}
          onEditId={handleEdit}
          isDark={isDark}
        />
      </div>

      {/* Pagination Controls */}
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

export default TeacherList;