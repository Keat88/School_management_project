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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {/* <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="user">User</option>
        </select> */}
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "teacher"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-50 text-slate-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-blue-100 px-2 py-1 text-slate-800 rounded-lg duration-200 transition-transform hover:bg-blue-400  mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-100 px-2 py-1 text-red-500 rounded-lg hover:text-red-600 duration-200 transition-transform hover:bg-red-50"
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
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchUsers(pagination.current_page - 1)}
          className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {pagination.current_page} of {pagination.last_page}
        </span>
        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => fetchUsers(pagination.current_page + 1)}
          className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit User" : "Create User"}
            </h2>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {isEditMode && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  {...(!isEditMode && { required: true })}
                  value={currentUser.password}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, password: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={currentUser.role}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
