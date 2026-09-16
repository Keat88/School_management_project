import React, { useState, useEffect } from "react";
import { api } from "../../../data/api";
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
    password: "",
  });
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

  // Handle delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers(pagination.current_page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
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

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage user accounts, permissions, and system roles.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={openCreateModal}
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>+ Add User</span>
          </button>
          {/* Role Filter Select (Uncomment if needed) */}
          {/* <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
                    >
                        <option value="All">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="user">User</option>
                    </select> */}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 shadow-xs rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          <table className="min-w-full overflow-x-scroll overflow-auto divide-y divide-slate-200 dark:divide-slate-800">
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
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          user.role === "admin"
                            ? "bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400"
                            : user.role === "teacher"
                              ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
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
                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-white border border-gray-200 dark:border-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 border border-red-200/60 dark:border-red-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={pagination.current_page === 1}
            onClick={() => fetchUsers(pagination.current_page - 1)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg disabled:opacity-50 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => fetchUsers(pagination.current_page + 1)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg disabled:opacity-50 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {isEditMode ? "Edit User" : "Create User"}
              </h2>
              {error && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-2xl mb-4 text-sm font-medium">
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
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
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
                      setCurrentUser({ ...currentUser, email: e.target.value })
                    }
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
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
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Role Select (Uncomment if needed) */}
                {/* <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Role
                                    </label>
                                    <select
                                        value={currentUser.role}
                                        onChange={(e) =>
                                            setCurrentUser({ ...currentUser, role: e.target.value })
                                        }
                                        className="mt-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                    >
                                        <option value="user">User</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div> */}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
                  >
                    {isEditMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
