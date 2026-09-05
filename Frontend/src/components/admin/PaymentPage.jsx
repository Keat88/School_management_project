import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { DollarSign, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import StatsGrid from "./StatsGrid";
import PaymentFilters from "./Paymentfilter";
import PaymentTable from "./Paymenttable";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;

// Replace with real API data once available.
const mockPayments = [
  {
    id: 1,
    studentName: "Sophea Kim",
    class: "Grade 9 - A",
    amount: 320,
    dueDate: "Aug 15, 2026",
    method: "Bank Transfer",
    status: "paid",
  },
  {
    id: 2,
    studentName: "Dara Sok",
    class: "Grade 9 - A",
    amount: 320,
    dueDate: "Aug 15, 2026",
    method: "Cash",
    status: "paid",
  },
  {
    id: 3,
    studentName: "Lina Chan",
    class: "Grade 9 - B",
    amount: 320,
    dueDate: "Aug 15, 2026",
    method: "—",
    status: "overdue",
  },
  {
    id: 4,
    studentName: "Vichet Ros",
    class: "Grade 10 - A",
    amount: 350,
    dueDate: "Aug 20, 2026",
    method: "Card",
    status: "pending",
  },
  {
    id: 5,
    studentName: "Chenda Ly",
    class: "Grade 10 - A",
    amount: 350,
    dueDate: "Aug 20, 2026",
    method: "Bank Transfer",
    status: "paid",
  },
  {
    id: 6,
    studentName: "Piseth Heng",
    class: "Grade 10 - B",
    amount: 350,
    dueDate: "Aug 20, 2026",
    method: "—",
    status: "overdue",
  },
  {
    id: 7,
    studentName: "Sreymom Ouk",
    class: "Grade 11 - A",
    amount: 380,
    dueDate: "Aug 25, 2026",
    method: "Cash",
    status: "paid",
  },
  {
    id: 8,
    studentName: "Ratanak Pich",
    class: "Grade 11 - A",
    amount: 380,
    dueDate: "Aug 25, 2026",
    method: "Card",
    status: "pending",
  },
  {
    id: 9,
    studentName: "Bopha Sam",
    class: "Grade 11 - B",
    amount: 380,
    dueDate: "Aug 25, 2026",
    method: "Bank Transfer",
    status: "paid",
  },
  {
    id: 10,
    studentName: "Sina Meas",
    class: "Grade 12 - A",
    amount: 400,
    dueDate: "Aug 28, 2026",
    method: "—",
    status: "overdue",
  },
  {
    id: 11,
    studentName: "Kunthea Prum",
    class: "Grade 12 - A",
    amount: 400,
    dueDate: "Aug 28, 2026",
    method: "Cash",
    status: "paid",
  },
  {
    id: 12,
    studentName: "Chantha Nov",
    class: "Grade 12 - B",
    amount: 400,
    dueDate: "Aug 28, 2026",
    method: "Card",
    status: "pending",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function PaymentPage() {
  const { currentUser } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return mockPayments.filter((payment) => {
      const matchesSearch = payment.studentName.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAGE_SIZE),
  );
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const revenue = useMemo(() => {
    const paid = mockPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = mockPayments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const overdue = mockPayments
      .filter((p) => p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);
    const total = paid + pending + overdue;

    return [
      {
        label: "Total Revenue",
        value: formatCurrency(total),
        icon: DollarSign,
        accent: "blue",
      },
      {
        label: "Paid",
        value: formatCurrency(paid),
        icon: CheckCircle2,
        accent: "green",
      },
      {
        label: "Pending",
        value: formatCurrency(pending),
        icon: Clock3,
        accent: "purple",
      },
      {
        label: "Overdue",
        value: formatCurrency(overdue),
        icon: AlertTriangle,
        accent: "orange",
      },
    ];
  }, []);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Admin-only guard. For multiple admin-only pages, consider lifting
  // this into a shared <ProtectedRoute allowedRoles={["admin"]} />.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Payments</h2>

      <StatsGrid stats={revenue} />

      <PaymentFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <PaymentTable payments={paginatedPayments} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default PaymentPage;
