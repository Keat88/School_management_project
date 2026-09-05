import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashBoardLayout";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./page/admin/dashobard/AdminDashBoard";
import StudentList from "./page/admin/student/Studentlist";
import TeacherList from "./page/admin/teacher/Teacherlist";
import ClassroomList from "./page/admin/classroom/Classroomlist";
import AttendancePage from "./page/admin/attendance/Attendancepage";
import PaymentPage from "./components/admin/PaymentPage";
import ClassroomDetail from "./components/admin/Classroomdetail";
import NoticePage from "./page/admin/notices/Noticepage";
import ReportPage from "./page/admin/reports/Reportpage";
import StudentForm from "./components/common/StudentForm";
import ProtectRoute from "./routes/ProtectRoute";
import LoginForm from "./page/auth/LoginForm";
import GuestRoute from "./routes/GuestRoute";
import StudentView from "./components/common/StudentView";
import TeacherForm from "./components/common/TeacherForm";
import ClassForm from "./components/common/ClassForm";
import ManageCategories from "./page/admin/book/ManageCategories";
import BookCategoryForm from "./page/admin/book/BookCategoryForm";
import BookCategoryView from "./page/admin/book/BookCategoryView";
import ManageBooks from "./page/admin/book/ManageBooks";
import BookForm from "./page/admin/book/BookForm";
import SchedulePage from "./page/admin/schedules/SchedulePage";
import HostelPage from "./page/admin/hostel_school/HostelPage";
import NoticeForm from "./page/admin/notices/NoticeForm";
import BookIssueList from "./page/admin/book/BookIssueList";
import BookReturnManagement from "./page/admin/book/BookReturnManagement";
import IssueBookForm from "./page/admin/book/IssueBookForm";
import ManageSubject from "./page/admin/book/ManageSubject";
import SubjectForm from "./page/admin/book/SubjectForm";
import HostelRoomForm from "./page/admin/hostel_school/MangeHostelForm";
import ManageHostelRooms from "./page/admin/hostel_school/ManageHostelRooms";
import StudentStayForm from "./page/admin/hostel_school/StudentStayForm";
import ManageStudentStays from "./page/admin/hostel_school/ManageStudentStays";
import AcademicYearManager from "./page/admin/AcademicYearManager";
import ScheduleForm from "./components/common/ScheDuleForm";
import ProfilePage from "./components/layout/ProfilePage";
import ForgotPasswordForm from "./page/auth/ForgotPasswordForm";
import VerifyOtp from "./page/auth/VerifyOtp";
import ResetPassword from "./page/auth/ResetPassword";
import LoginSuccess from "./page/auth/LoginSuccess";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Guest Routes (Only accessible when NOT logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/forgot-password-verify" element={<VerifyOtp/>} />
          <Route path="/forgot-password-reset" element={<ResetPassword/>} />
        </Route>
        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Student Routes */}
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/add" element={<StudentForm />} />
            <Route path="/students/add/:id" element={<StudentForm />} />
            <Route path="/students/view/:id" element={<StudentView />} />

            {/* Teacher & Class Routes */}
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/teacher/add" element={<TeacherForm />} />
            <Route path="/teacher/add/:id" element={<TeacherForm />} />
            <Route path="/classes" element={<ClassroomList />} />
            <Route path="/classes/add" element={<ClassForm />} />
            <Route path="/classes/:id" element={<ClassroomDetail />} />
            <Route path="/academic-year" element={<AcademicYearManager/>}/>
            {/* Other Admin Sections */}
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/schedule-form" element={<ScheduleForm/>}/>
            <Route path="/hostel" element={<HostelPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/subjects" element={<ManageSubject />} />
            <Route path="/subjects/add" element={<SubjectForm />} />
            <Route path="/subjects/add/:id" element={<SubjectForm />} />

            {/* for library it still not work cause not connect with api */}
            {/* <Route path="/library" element={<BookReturnManagement />} /> */}
            <Route path="/library/category" element={<ManageCategories />} />
            <Route
              path="/library/category/add"
              element={<BookCategoryForm />}
            />
            <Route
              path="/library/category/add/:id"
              element={<BookCategoryForm />}
            />
            <Route
              path="/library/category/view/:id"
              element={<BookCategoryView />}
            />
            <Route path="/library/books" element={<ManageBooks />} />
            <Route path="/library/book/add" element={<BookForm />} />
            <Route path="/library/book/add/:id" element={<BookForm />} />
            <Route path="/library/bookissue" element={<BookIssueList />} />
            <Route path="/library/bookissue/add" element={<IssueBookForm />} />
            <Route
              path="/library/bookissue/add/:id"
              element={<IssueBookForm />}
            />
            <Route
              path="/library/bookreturn"
              element={<BookReturnManagement />}
            />

            {/* for hostel */}
            <Route path="/hostel-rooms" element={<ManageHostelRooms />} />
            <Route path="/hostel-rooms/add" element={<HostelRoomForm />} />
            <Route path="/hostel-rooms/add/:id" element={<HostelRoomForm />} />

            <Route path="/hostel-stays" element={<ManageStudentStays />} />
            <Route path="/hostel-stays/add" element={<StudentStayForm />} />
            <Route path="/hostel-stays/add/:id" element={<StudentStayForm />} />

            <Route path="/finance" element={<PaymentPage />} />
            {/* for notice  */}
            <Route path="/notices" element={<NoticePage />} />
            <Route path="/notice/add" element={<NoticeForm />} />
            <Route path="/notice/add/:id" element={<NoticeForm />} />
            {/* for report page  */}
            <Route path="/reports" element={<ReportPage />} />
          </Route>
        </Route>
        {/* Fallback Redirect for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
