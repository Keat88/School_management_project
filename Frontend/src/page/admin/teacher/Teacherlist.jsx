import { useCallback, useEffect, useState } from "react";
import TeacherFilters from "../../../components/admin/Teacherfilters";
import TeacherTable from "../teacher/Teachertable";
import { teacherApi } from "../../../data/TeacherApi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../hooks/Pagination";

function TeacherList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setIsOpen] = useState(false);
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

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

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
          <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage and view teacher records
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          Total: {totalItems}
        </span>
      </div>

      {/* Search Filter Component */}
      <TeacherFilters
        searchValue={searchValue}
        genderValue={gender}
        onSearchChange={setSearchValue}
        onGenderChange={handleGenderChange}
      />

      {/* Table Component with dynamic loading overlay/state */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-xl transition-all">
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-gray-600 mt-2">
              Loading page...
            </span>
          </div>
        )}

        <TeacherTable
          teachers={teachers}
          loading={loading}
          onDeleteId={handleDelete}
          onEditId={handleEdit}
          onOpen={handleIsOpen}
          open={open}
        />
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default TeacherList;
