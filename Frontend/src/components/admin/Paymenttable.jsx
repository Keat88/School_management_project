import PaymentStatusBadge from "./Paymentstatusbadge";

function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function PaymentTable({ payments = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-4 py-3 font-medium text-gray-500">Student</th>
              <th className="px-4 py-3 font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 font-medium text-gray-500">Due Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Method</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No payments match your filters.
                </td>
              </tr>
            )}

            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {initials(payment.studentName)}
                    </div>
                    <span className="font-medium text-gray-800 whitespace-nowrap">
                      {payment.studentName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {payment.class}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {payment.dueDate}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {payment.method}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PaymentStatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;