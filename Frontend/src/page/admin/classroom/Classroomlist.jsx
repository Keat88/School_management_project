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

  // State សម្រាប់ Pagination & Data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [classRoom, setClassRoom] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = (classroom) => {
    navigate(`/admin/classes/${classroom.id}`);
  };

  // 1. Fetch Class Data ជាមួយ Pagination Params
  const fetchClass = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await classRoomApi.getAll({
        page: page,
        per_page: 8, // បង្ហាញ 8 Cards ក្នុង ១ ទំព័រ (ត្រូវជាមួយ Layout Grid 4)
      });

      // Extract Data ចេញពី Laravel Custom Response Format
      const responseData = response?.data;

      if (responseData) {
        setClassRoom(responseData.data || []);
        if (responseData.meta) {
          setCurrentPage(responseData.meta.current_page || 1);
          setTotalPages(responseData.meta.last_page || 1);
          setTotalItems(responseData.meta.total || 0);
        }
      } else {
        setClassRoom([]);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setClassRoom([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Trigger fetchClass រាល់ពេល currentPage ផ្លាស់ប្តូរ
  useEffect(() => {
    fetchClass(currentPage);
  }, [currentPage, fetchClass]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Classes</h2>
        <span className="text-sm text-gray-500">
          Total: {totalItems} classes
        </span>
      </div>

      {/* Filter Component */}
      <ClassFilter />

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading cagetegory...</span>
        </div>
      ) : Array.isArray(classRoom) && classRoom.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {classRoom.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
          ពុំមានទិន្នន័យថ្នាក់រៀនឡើយ
        </div>
      )}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={8}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ClassroomList;
