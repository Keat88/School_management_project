import { useCallback, useEffect, useState } from "react";
import TeacherFilters from "../../../components/admin/Teacherfilters";
import TeacherTable from "../teacher/Teachertable";
import { teacherApi } from "../../../data/TeacherApi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../hooks/Pagination";
import ModalDelete from "../../../hooks/ModalDelete";
import HeaderPage from "../../../hooks/HeaderPage";

function TeacherList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDeleteId, setClassToDeleteId] = useState(null);

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

  const openDeleteModal = (id) => {
    setClassToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClassToDeleteId(null);
  };
  const handleConfirmDelete = async () => {
    if (!classToDeleteId) return;
    try {
      setLoading(true);
      await teacherApi.delete(classToDeleteId);
      setIsDeleteModalOpen(false);
      setClassToDeleteId(null);
      fetchTeacher(debouncedSearch, gender, currentPage);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <ModalDelete
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title={'Delete Teacher'}
            desciption={' Are you sure you want to delete this theacher? This action cannot be undone.'}
          />
        </div>
      )}
      <div className="space-y-6">
        <HeaderPage 
          title="Teachers" 
          description="Manage and view teacher records" 
          totalItems={totalItems} 
          titlefound="Teacher found" 
        />
        {/* Search Filter Component */}
        <TeacherFilters
          searchValue={searchValue}
          genderValue={gender}
          onSearchChange={setSearchValue}
          onGenderChange={handleGenderChange}
        />
        {/* Table Container */}
        <div>
          <TeacherTable
            teachers={teachers}
            onDeleteId={openDeleteModal}
            onEditId={handleEdit}
          />
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 sm:mt-6 w-full">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={10}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default TeacherList;