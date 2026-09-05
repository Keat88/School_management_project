const audienceStyles = {
  all: "bg-gray-100 text-gray-600",
  students: "bg-blue-50 text-[#2563EB]",
  teachers: "bg-green-50 text-green-600",
  parents: "bg-purple-50 text-purple-600"
};

const audienceLabels = {
  all: "All",
  students: "Students",
  teachers: "Teachers",
  parents: "Parents"
};

function AudienceBadge({ audience }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        audienceStyles[audience] || "bg-gray-100 text-gray-500"
      }`}
    >
      {audienceLabels[audience] || audience}
    </span>
  );
}

export default AudienceBadge;