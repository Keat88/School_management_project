import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Trash2 } from "lucide-react";
import { api } from "../../../data/api";
import { BookIssureApi } from "../../../data/library";


export default function BookIssueList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const fetchIssues = async () => {
    try {
      const response = await BookIssureApi.getAll();
      const result = response.data?.data || response.data || response;
      setIssues(Array.isArray(result) ? result : []);
    } catch (error) {
      console.log("Error fetching issued books:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleReturn = async (id) => {
    try {
     const response= await BookIssureApi.ReturnIssurce(id)
      setFeedback({ type: "success", text: response?.message || response?.data || response});
      fetchIssues();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to process book return.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue record?")) return;
    try {
      await api.delete(`/library/issues/${id}`);
      setFeedback({ type: "success", text: "Record deleted successfully!" });
      setIssues(issues.filter((item) => item.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete record.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Issued Books Management</h2>
        <button
          type="button"
          onClick={() => navigate("/library/bookissue/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Issue Book
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Loading issued books...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    No issued book records found.
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {item.student?.name || `Student ID: ${item.student_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {item.book?.title || `Book ID: ${item.book_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {item.issue_date}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {item.due_date}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {item.return_date || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "returned"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.status || "issued"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "returned" && (
                          <button
                            type="button"
                            onClick={() => handleReturn(item.id)}
                            title="Mark as Returned"
                            className="p-1 text-green-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className="p-1 text-red-500 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}