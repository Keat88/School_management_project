const hostels = [
  {
    id: 1,
    name: "Sunrise Boys Hostel",
    type: "Boys",
    capacity: 120,
    occupied: 96,
    warden: "Mr. Vannareth Sok",
  },
  {
    id: 2,
    name: "Orchid Girls Hostel",
    type: "Girls",
    capacity: 100,
    occupied: 82,
    warden: "Mrs. Sreyleak Chan",
  },
  {
    id: 3,
    name: "Teacher Residence Hall",
    type: "Staff",
    capacity: 40,
    occupied: 24,
    warden: "Mr. Rithy Kao",
  },
];

const mockOccupants = [
  // Students
  { id: 1, name: "Chanra Vong", type: "Student", hostel: "Sunrise Boys Hostel", room: "B-101", bed: "Bed 2", checkIn: "2026-01-05", status: "active" },
  { id: 2, name: "Meyleak Peng", type: "Student", hostel: "Orchid Girls Hostel", room: "G-201", bed: "Bed 1", checkIn: "2026-01-05", status: "active" },
  { id: 3, name: "Dara Pich", type: "Student", hostel: "Sunrise Boys Hostel", room: "B-102", bed: "Bed 4", checkIn: "2026-02-11", status: "active" },
  { id: 4, name: "Sokunthea Ly", type: "Student", hostel: "Orchid Girls Hostel", room: "G-202", bed: "Bed 3", checkIn: "2026-02-18", status: "active" },
  { id: 5, name: "Visal Kim", type: "Student", hostel: "Sunrise Boys Hostel", room: "B-103", bed: "Bed 1", checkIn: "2026-03-02", status: "inactive" },
  // Teachers
  { id: 6, name: "Malis Ouk", type: "Teacher", hostel: "Teacher Residence Hall", room: "T-01", bed: "Room 01", checkIn: "2025-11-20", status: "active" },
  { id: 7, name: "Reth Vong", type: "Teacher", hostel: "Teacher Residence Hall", room: "T-02", bed: "Room 02", checkIn: "2025-12-01", status: "active" },
  { id: 8, name: "Vibol Heng", type: "Teacher", hostel: "Teacher Residence Hall", room: "T-03", bed: "Room 03", checkIn: "2026-01-12", status: "inactive" },
];

export { hostels, mockOccupants };
