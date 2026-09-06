import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { classRoomApi } from "../../../data/classrooms";
import ClassroomCard from "../../../components/admin/ClassroomCard";
import ClassFilter from "../../../components/admin/ClassFilter";
import { useCallback, useEffect, useState } from "react";
import Pagination from "../../../hooks/Pagination";

function ClassroomList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [classRoom, setClassRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Search & Filter States
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  // Filter Dropdown Options State
  const [gradeOptions, setGradeOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset to page 1 on new search term
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // 2. Filter Handlers
  const handleGradeChange = (val) => {
    setGradeFilter(val);
    setCurrentPage(1);
  };

  const handleSectionChange = (val) => {
    setSectionFilter(val);
    setCurrentPage(1);
  };

  const handleClassChange = (val) => {
    setClassFilter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setDebouncedSearch("");
    setGradeFilter("all");
    setSectionFilter("all");
    setClassFilter("all");
    setCurrentPage(1);
  };

  // 3. Fetch Classrooms Data from API
  const fetchClass = useCallback(
    async (
      searchQuery = "",
      page = 1,
      grade = "all",
      section = "all",
      cls = "all",
    ) => {
      try {
        setLoading(true);
        setErrorMessage("");

        const params = {
          search: searchQuery,
          page: page,
          per_page: 8,
        };

        if (grade !== "all") params.grade = grade;
        if (section !== "all") params.section = section;
        if (cls !== "all") params.class_id = cls;

        const response = await classRoomApi.getAll(params);

        // Handle response structure ({ data: [...] } or direct array)
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setClassRoom(list);

        // Extract filter options from additional resource metadata or fallbacks
        const gradesList = response?.grades || [
          ...new Set(list.map((item) => item.grade).filter(Boolean)),
        ];
        setGradeOptions(gradesList);

        const sectionsList = response?.sections || [
          ...new Set(list.map((item) => item.section).filter(Boolean)),
        ];
        setSectionOptions(sectionsList);

        const classesList = response?.classes || [
          ...new Set(
            list.map((item) => ({
              id: item.id,
              name: item.name || `Grade ${item.grade} - ${item.section}`,
            })),
          ),
        ];
        setClassOptions(classesList);

        // Extract pagination details
        const meta = response?.meta || response;
        setCurrentPage(meta?.current_page || 1);
        setTotalPages(meta?.last_page || 1);
        setTotalItems(meta?.total || list.length);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        setErrorMessage("បរាជ័យក្នុងការទាញយកទិន្នន័យថ្នាក់រៀន។");
        setClassRoom([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  // 4. Trigger API Call on search, page, or filter changes
  useEffect(() => {
    fetchClass(
      debouncedSearch,
      currentPage,
      gradeFilter,
      sectionFilter,
      classFilter,
    );
  }, [
    debouncedSearch,
    currentPage,
    gradeFilter,
    sectionFilter,
    classFilter,
    fetchClass,
  ]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (classroom) => {
    navigate(`/admin/classes/${classroom.id}`);
  };

  const handleEdit = (classroom) => {
    navigate(`/admin/classes/add/${classroom.id}`);
  };

  const handleDelete = async (classroom) => {
    const classroomName =
      classroom.name || `Grade ${classroom.grade} - ${classroom.section}`;

    if (
      !window.confirm(`តើអ្នកប្រាកដជាចង់លុបថ្នាក់ ${classroomName} នេះមែនទេ?`)
    ) {
      return;
    }

    try {
      await classRoomApi.delete(classroom.id);
      fetchClass(
        debouncedSearch,
        currentPage,
        gradeFilter,
        sectionFilter,
        classFilter,
      );
    } catch (error) {
      console.error("Error deleting classroom:", error);
      const apiMessage =
        error.response?.data?.message || "បរាជ័យក្នុងការលុបថ្នាក់រៀន។";
      alert(apiMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Classes
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage and view classroom records
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
          Total: {totalItems} classes
        </span>
      </div>

      {/* Filter Component */}
      <ClassFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        gradeFilter={gradeFilter}
        onGradeChange={handleGradeChange}
        gradeOptions={gradeOptions}
        sectionFilter={sectionFilter}
        onSectionChange={handleSectionChange}
        sectionOptions={sectionOptions}
        classFilter={classFilter}
        onClassChange={handleClassChange}
        classOptions={classOptions}
        onResetFilters={handleResetFilters}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Content Grid */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-gray-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-gray-500 mt-2">
              កំពុងទាញយកទិន្នន័យថ្នាក់រៀន...
            </span>
          </div>
        ) : Array.isArray(classRoom) && classRoom.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {classRoom.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                onViewDetails={handleViewDetails}
                onUpdateRoom={handleEdit}
                onDeleteRoom={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-sm font-medium">ពុំមានទិន្នន័យថ្នាក់រៀនឡើយ</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={8}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default ClassroomList;
