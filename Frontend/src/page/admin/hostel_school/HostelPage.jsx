import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { hostels, mockOccupants } from "../../../data/hostels";
import HostelStats from "../../../components/admin/HostelStats";
import HostelOverview from "../../../components/admin/HostelOverview";
import HostelFilters from "../../../components/admin/HostelFilters";
import HostelTable from "../../../components/admin/HostelTable";

function HostelPage() {
  const { currentUser } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredOccupants = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return mockOccupants.filter((occupant) => {
      const matchesSearch =
        occupant.name.toLowerCase().includes(query) ||
        occupant.hostel.toLowerCase().includes(query) ||
        occupant.room.toLowerCase().includes(query);
      const matchesType =
        typeFilter === "all" || occupant.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchValue, typeFilter]);

  const handleAddResident = () => {
    // Hook this up to a modal / form / route once the add-resident flow exists.
    console.log("Add Resident clicked");
  };

  const handleEdit = (occupant) => {
    console.log("Edit resident", occupant.id);
  };

  const handleDelete = (occupant) => {
    console.log("Delete resident", occupant.id);
  };

  // Admin-only guard. For multiple admin-only pages, consider lifting
  // this into a shared <ProtectedRoute allowedRoles={["admin"]} />.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
        Hostel Management
      </h1>

      <HostelStats hostels={hostels} occupants={mockOccupants} />

      <HostelOverview hostels={hostels} />

      <div className="space-y-4">
        <HostelFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          onAddResident={handleAddResident}
        />

        <HostelTable
          occupants={filteredOccupants}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default HostelPage;