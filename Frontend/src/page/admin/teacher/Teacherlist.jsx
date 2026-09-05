import { useEffect, useState } from "react";
import TeacherFilters from "../../../components/admin/Teacherfilters";
import TeacherTable from "../teacher/Teachertable";
import { teacherApi } from "../../../data/TeacherApi";
import { useNavigate } from "react-router-dom";

function TeacherList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setIsOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const fetchTeacher = async (query = "") => {
    try {
      setLoading(true);
      const response = await teacherApi.getAll({
        search: query,
      });
      const result = response.data?.data || response.data || response;
      setTeachers(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log("error", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher(debouncedSearch);
  }, [debouncedSearch]);

  const handleIsOpen = () => {
    setIsOpen(!open);
  };

  const handleEdit = (id) => {
    navigate(`/teacher/add/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await teacherApi.delete(id);
      fetchTeacher(debouncedSearch);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      {loading && teachers.length === 0 ? (
        <div className="flex text-center justify-center items-center min-h-screen bg-white w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
            <span className="text-sm text-gray-500"></span>
          </div>
          <TeacherFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />

          <TeacherTable
            teachers={teachers}
            onDeleteId={handleDelete}
            onEditId={handleEdit}
            onOpen={handleIsOpen}
            open={open}
            isOpen={false}
          />
        </div>
      )}
    </>
  );
}

export default TeacherList;