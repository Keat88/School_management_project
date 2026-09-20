import React, { useState, useEffect } from "react";
import { api } from "../../../data/api";
import { Plus, AlertTriangle, Edit3, Trash2 } from "lucide-react";
import Pagination from "../../../hooks/Pagination";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal states for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  // Modal states for Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users with search, role, and pagination
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users`, {
        params: {
          page,
          search: search || undefined,
          role: roleFilter !== "All" ? roleFilter : undefined,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [search, roleFilter]);

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditMode) {
        await api.put(`/admin/users/${currentUser.id}`, currentUser, {
          headers,
        });
      } else {
        await api.post("/admin/users", currentUser, { headers });
      }

      setIsModalOpen(false);
      resetForm();
      fetchUsers(pagination.current_page);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError("An error occurred while saving the user.");
      }
    }
  };

  // Trigger Delete Modal
  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userIdToDelete) return;
    try {
      await api.delete(`/admin/users/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsDeleteModalOpen(false);
      setUserIdToDelete(null);
      fetchUsers(pagination.current_page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
      setIsDeleteModalOpen(false);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserIdToDelete(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentUser({ id: "", name: "", email: "", role: "user", password: "" });
    setError(null);
  };

  const getRoleBadgeClass = (role) => {
    if (role === "admin") {
      return "bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400";
    }
    if (role === "teacher") {
      return "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400";
    }
    return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  };

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-300 ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Manage user accounts, permissions, and system roles.
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 transition-colors"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>

        {/* Loading / Empty States Shared */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading users...
              </span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-16 text-center text-slate-500 dark:text-slate-400 text-sm">
            No users found.
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card List Layout (Visible on mobile only) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize shrink-0 ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-xs transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-lg font-medium text-xs transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Table Layout (Hidden on mobile) */}
            <div className="hidden md:block bg-white dark:bg-slate-900  overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-950/50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg capitalize ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer bg-slate-500 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-xs active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer bg-red-600 hover:bg-red-700 text-white shadow-xs active:scale-95"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination Component */}
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={fetchUsers}
        />

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 my-auto">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                {isEditMode ? "Edit User" : "Create User"}
              </h2>
              {error && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-xl mb-4 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={currentUser.name}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, name: e.target.value })
                    }
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={currentUser.email}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <select
                    value={currentUser.role}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        role: e.target.value,
                      })
                    }
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password{" "}
                    <span className="text-xs text-slate-400">
                      {isEditMode && "(Leave blank to keep current)"}
                    </span>
                  </label>
                  <input
                    type="password"
                    {...(!isEditMode && { required: true })}
                    value={currentUser.password}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                  >
                    {isEditMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 sm:p-6 shadow-xl space-y-4 text-center my-auto">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete User
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}