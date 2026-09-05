import  { useState } from "react";

export default function SingleStudentMessageModal({ student, onClose, onUnlock, onSendMessage }) {
  const [replyText, setReplyText] = useState("");

  if (!student) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onSendMessage) {
      onSendMessage(student.id, replyText);
    }
    setReplyText("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              {student.studentName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">{student.studentName}</h2>
              <p className="text-xs text-gray-500">{student.className || student.class}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200/50 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-center">
              <span className="block text-xs font-semibold text-emerald-600 uppercase">Present</span>
              <span className="text-xl font-bold text-emerald-700">{student.presentCount ?? 0}</span>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-xl text-center">
              <span className="block text-xs font-semibold text-rose-600 uppercase">Absent</span>
              <span className="text-xl font-bold text-rose-700">{student.absentCount ?? 0}</span>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl text-center">
              <span className="block text-xs font-semibold text-amber-600 uppercase">Status</span>
              <span className="text-xs font-bold text-amber-700 mt-1 block">
                {student.isLocked ? "🔒 Auto-Locked" : "✅ Active"}
              </span>
            </div>
          </div>

          {/* Admin Unlock Warning Banner if Locked */}
          {student.isLocked && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Account Auto-Locked</h4>
                <p className="text-xs text-rose-600 mt-0.5">
                  This student has exceeded the maximum absence limit and cannot check-in anymore.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUnlock && onUnlock(student.id)}
                className="px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 shadow-sm transition cursor-pointer shrink-0"
              >
                Unlock Student
              </button>
            </div>
          )}

          {/* Messages History List */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Excuse / Message History
            </h3>
            
            <div className="space-y-3">
              {student.messages && student.messages.length > 0 ? (
                student.messages.map((msg, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{msg.date}</span>
                      <span className="font-medium text-indigo-600">{msg.sender || "Student"}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No messages or excuse notes recorded for this student.
                </div>
              )}
            </div>
          </div>

          {/* Reply Input Box */}
          <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-600">Send Message to Student</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a message or warning regarding attendance..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition cursor-pointer shadow-sm"
              >
                Send
              </button>
            </div>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}