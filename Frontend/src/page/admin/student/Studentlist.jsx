import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StudentFilters from "../../../components/admin/Studentfilters";
import StudentTable from "../../../components/admin/Studenttable";
import { studentData } from "../../../data/StudentsApi";
import { classRoomApi } from "../../../data/classrooms";



function StudentList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    grade: "",
    section: "",
  });

  // Automatically sync individual filter states into the `filters` object
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      gender: genderFilter === "all" ? "" : genderFilter,
      grade: classFilter === "all" ? "" : classFilter,
    }));
  }, [searchValue, genderFilter, classFilter]);

  const fetchStudent = async () => {
    try {
      const response = await studentData.getAll(filters);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchClass = async () => {
    try {
      const response = await classRoomApi.getAll();
      setClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);

  useEffect(() => {
    fetchStudent();
  }, [filters]);

  const classOptions = useMemo(() => {
    return [...new Set(classes.map((c) => c.grade || c.name))].sort();
  }, [classes]);

  // Rename 'delete' to a valid identifier like 'handleDelete' (since 'delete' is a JS reserved keyword)
  const handleView = (id) => {
     try {
      navigate(`/students/view/${id}`);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  } 
  const handleDelete = async (id) => {
    try {
      await studentData.delete(id);
      fetchStudent();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  const handleEdit = async (id) => {
    try {
      navigate(`/students/add/${id}`);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <span className="text-sm text-gray-500">
          {students.length} students found
        </span>
      </div>

      <StudentFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        classFilter={classFilter}
        onClassChange={setClassFilter}
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        classOptions={classOptions}
      />

      <StudentTable
        students={students}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
      />
    </div>
  );
}

export default StudentList;
