import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  console.log(user);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "Phnom Penh, Cambodia",
    image: null,
    previewImage: user.avatar || "https://via.placeholder.com/150",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect this to your Laravel API endpoint using Axios or Fetch (FormData object)
    console.log("Updated Profile Data:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-w-160 mx-auto p-4">
      <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800">My Profile</h1>
            {user.google_id && (
              <span className="text-xs  text-slate-500 border border-gray-200 px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.94 3.08-3.74 3.08-2.28 0-4.13-1.85-4.13-4.13s1.85-4.13 4.13-4.13c1.03 0 1.96.38 2.68 1.01l2.04-2.04c-1.33-1.24-3.1-2.01-5.12-2.01-4.22 0-7.64 3.42-7.64 7.64s3.42 7.64 7.64 7.64c4.41 0 7.33-3.1 7.33-7.46 0-.52-.05-1.04-.13-1.54z"
                  />
                </svg>
                Google Account
              </span>
            )}
            {user.github_id && (
              <span className="text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-medium">
                GitHub Account
              </span>
            )}
          </div>
          <span className="text-xs bg-blue-100 text-blue-500 px-3 py-1 rounded-lg font-medium  tracking-wider">
            Teacher / Admin
          </span>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex items-center gap-6">
            <img
              src={formData.previewImage}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 cursor-pointer transition"
              />
              <p className="text-xs text-slate-400 mt-1">
                Allowed JPG, JPEG, or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location / Address
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter city or address"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
