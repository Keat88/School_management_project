import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  RotateCcw,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { subjectApi } from "../../../data/classrooms";
import Pagination from "../../../hooks/Pagination";
import { colorbtn } from "../../../data/datafeature";
import HeaderPage from "../../../hooks/HeaderPage";
import ModalDelete from "../../../hooks/ModalDelete";
export default function ManageSubject({ isDark: propIsDark = false }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Sync with localStorage changes across components/tabs if theme toggles elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme =
        localStorage.getItem("theme") || localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark" || savedTheme === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchSubjects = useCallback(async (page, searchQuery) => {
    setLoading(true);
    try {
      const response = await subjectApi.getAll({
        per_page: 10,
        page: page,
        search: searchQuery || undefined,
      });

      const outerData = response?.data || response;
      const paginatedPayload = outerData?.data || outerData;

      const items = Array.isArray(paginatedPayload)
        ? paginatedPayload
        : paginatedPayload?.data || [];

      const meta = paginatedPayload?.meta || outerData?.meta || {};

      setSubjects(items);
      setTotalPages(meta?.last_page || 1);
      setTotalItems(meta?.total || 0);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects(currentPage, activeSearch);
  }, [currentPage, activeSearch, fetchSubjects]);

  // Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search);
    setCurrentPage(1);
  };

  // Reset Search
  const handleResetSearch = () => {
    setSearch("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  // Change Page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (id) => {
    setSubjectToDelete(id);
    setIsDeleteModalOpen(true);
    setFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await subjectApi.delete(subjectToDelete);
      setFeedback({ type: "success", text: "Subject deleted successfully!" });
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
      fetchSubjects(currentPage, activeSearch);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete subject.",
      });
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubjectToDelete(null);
  };

  return (
    <div className="space-y-6 w-full lg:min-w-260 mx-auto transition-colors text-slate-900 dark:text-slate-100 ">
      {/* Header Section */}
      <HeaderPage title={' Manage Subjects'} description={' Configure and manage school subjects and course codes.'} totalItems={totalItems} titlefound={'subject'}/>
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60"
          }`}
        >
          {feedback.text}
        </div>
      )}
      {/* Search Bar & Actions */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-4 rounded-xl border flex flex-col md:flex-row gap-3 transition-colors shadow-2xs bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-900 dark:text-slate-100"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name or code..."
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetSearch}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs active:scale-98"
          >
            Search
          </button>
          <Link
            to="/admin/subjects/add"
            className={colorbtn.btnadd}
          >
            <Plus size={16} />
            Add Subject
          </Link>
        </div>
      </form>

      {/* Subject List Container */}
      <div className="p-3 sm:p-5 space-y-4 transition-colors text-slate-800 dark:text-slate-100">
        {/* Loading / Empty / Content States */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-400">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500 dark:border-blue-400"></div>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                Loading subjects...
              </span>
            </div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-400 text-sm">
            No subjects found.
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card List Layout (Visible on mobile only) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {sub.subject_name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium border bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300 shrink-0">
                      {sub.code}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <Link
                      to={`/admin/subjects/add/${sub.id}`}
                       className={colorbtn.btnedit}
                    ><Edit size={16}/>

                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(sub.id)}
                      className={colorbtn.btndelete}
                    >
                      <Trash size={16}/>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Table Layout (Hidden on mobile) */}
            <div className="hidden rounded-lg md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-semibold uppercase tracking-wider border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                    <th className="px-4 py-3.5">Subject Name</th>
                    <th className="px-4 py-3.5">Code</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm divide-slate-100 dark:divide-slate-700/80">
                  {subjects.map((sub) => (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700/40"
                    >
                      <td className="px-4 py-3.5 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                        {sub.subject_name}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium border bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                          {sub.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/subjects/add/${sub.id}`}
                            className={colorbtn.btnedit}
                            title="Edit"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(sub.id)}
                            className={colorbtn.btndelete}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={10}
        onPageChange={handlePageChange}
        isDark={isDark}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <ModalDelete
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title={"Delete Subject"}
            desciption={
              "Are you sure you want to delete this subject? This action cannot  be undone."
            }
          />
        </div>
      )}
    </div>
  );
}
