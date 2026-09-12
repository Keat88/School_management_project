import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-extrabold">
          403
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Access Denied</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            You do not have the required permissions to view this page. Please log in with an authorized account or return to the homepage.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="w-full inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm py-3 px-6 rounded-xl transition shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}