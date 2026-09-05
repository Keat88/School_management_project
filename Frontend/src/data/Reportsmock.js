import { Users, CalendarCheck2, TrendingUp, DollarSign } from "lucide-react";

// Replace with real API data once available.

export const reportStats = [
  {
    label: "Total Students",
    value: "1,284",
    trend: "+3.2%",
    icon: Users,
    accent: "blue",
  },
  {
    label: "Avg. Attendance",
    value: "92%",
    trend: "+1.1%",
    icon: CalendarCheck2,
    accent: "green",
  },
  {
    label: "Avg. Performance",
    value: "78%",
    trend: "+2.4%",
    icon: TrendingUp,
    accent: "orange",
  },
  {
    label: "Fees Collected",
    value: "$48,200",
    trend: "+8.4%",
    icon: DollarSign,
    accent: "purple",
  },
];

export const attendanceTrend = [
  { date: "Aug 4", rate: 91 },
  { date: "Aug 11", rate: 89 },
  { date: "Aug 18", rate: 93 },
  { date: "Aug 25", rate: 90 },
  { date: "Sep 1", rate: 94 },
  { date: "Sep 8", rate: 92 },
];

export const performanceBySubject = [
  { subject: "Math", average: 76 },
  { subject: "English", average: 82 },
  { subject: "Physics", average: 71 },
  { subject: "Chemistry", average: 74 },
  { subject: "Biology", average: 80 },
  { subject: "History", average: 85 },
];

export const feeCollectionByMonth = [
  { month: "Apr", collected: 32000, pending: 6000 },
  { month: "May", collected: 35500, pending: 5200 },
  { month: "Jun", collected: 31000, pending: 7800 },
  { month: "Jul", collected: 40200, pending: 4100 },
  { month: "Aug", collected: 48200, pending: 9800 },
];

export const activityLogs = [
  {
    id: 1,
    user: "Admin",
    action: "Generated monthly fee report",
    timestamp: "Sep 8, 2026 - 9:12 AM",
  },
  {
    id: 2,
    user: "Mr. Chan",
    action: "Marked attendance for Grade 10 - A",
    timestamp: "Sep 8, 2026 - 8:05 AM",
  },
  {
    id: 3,
    user: "Ms. Reth",
    action: "Updated student grades for Physics",
    timestamp: "Sep 7, 2026 - 4:47 PM",
  },
  {
    id: 4,
    user: "Admin",
    action: "Published notice: Mid-term exam schedule",
    timestamp: "Sep 7, 2026 - 2:15 PM",
  },
  {
    id: 5,
    user: "System",
    action: "Auto-flagged 3 overdue fee payments",
    timestamp: "Sep 6, 2026 - 11:30 PM",
  },
  {
    id: 6,
    user: "Mr. Vong",
    action: "Added new class: Grade 9 - C",
    timestamp: "Sep 6, 2026 - 10:02 AM",
  },
];
