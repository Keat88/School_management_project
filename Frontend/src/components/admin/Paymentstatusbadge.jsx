const statusStyles = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-orange-50 text-orange-500",
  overdue: "bg-red-50 text-red-500"
};

const statusLabels = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue"
};

function PaymentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export default PaymentStatusBadge;