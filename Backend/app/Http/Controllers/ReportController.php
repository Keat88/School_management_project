<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Resulte;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', '2026-01-01');
        $endDate = $request->get('end_date', now()->toDateString());

        $totalStudents = Students::count();

        // Fetch attendance records safely using date bounds
        $attendanceRecords = Attendance::whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate)
            ->get();

        $totalAttendanceCount = $attendanceRecords->count();

        // Unified status check (using 'present' consistently)
        $presentCount = $attendanceRecords->where('status', 'present')->count();
        $avgAttendanceRate = $totalAttendanceCount > 0 ? round(($presentCount / $totalAttendanceCount) * 100) : 0;

        // Fixed datetime cutoff for average score
        $averageScore = Resulte::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->avg('marks_obtained');

        $feesCollected = Payment::where('status', 'paid')
            ->whereBetween('due_date', [$startDate, $endDate])
            ->sum('amount');

        $stats = [
            [
                'label' => 'Total Students',
                'value' => number_format($totalStudents),
                'trend' => '+3.2%',
                'icon'  => 'users', // Icon identifier
            ],
            [
                'label' => 'Avg. Attendance',
                'value' => $avgAttendanceRate . '%',
                'trend' => '+1.1%',
                'icon'  => 'attendance',
            ],
            [
                'label' => 'Avg. Performance',
                'value' => round($averageScore ?? 0) . '%',
                'trend' => '+2.4%',
                'icon'  => 'performance',
            ],
            [
                'label' => 'Fees Collected',
                'value' => '$' . number_format($feesCollected),
                'trend' => '+8.4%',
                'icon'  => 'fees',
            ],
        ];
        // Unified attendance trend query matching 'present' status
        $attendanceTrend = Attendance::select(
            'date',
            DB::raw('sum(case when status = "present" then 1 else 0 end) as present_count'),
            DB::raw('count(*) as total_count')
        )
            ->whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                $rate = $item->total_count > 0 ? round(($item->present_count / $item->total_count) * 100) : 0;
                return [
                    'date' => date('M j', strtotime($item->date)),
                    'rate' => $rate,
                ];
            });

        // 3. Performance by Subject
        $performanceBySubject = Resulte::join('exams', 'resultes.exam_id', '=', 'exams.id')
            ->leftJoin('subjects', 'exams.subject_id', '=', 'subjects.id')
            ->whereDate('resultes.created_at', '>=', $startDate)
            ->whereDate('resultes.created_at', '<=', $endDate)
            ->select('subjects.id', 'subjects.subject_name as subject_name', DB::raw('avg(resultes.marks_obtained) as avg_score'))
            ->groupBy('subjects.id', 'subjects.subject_name')
            ->get()
            ->map(function ($item) {
                return [
                    'subject' => $item->subject_name ?? 'General',
                    'average' => round($item->avg_score ?? 0),
                ];
            });

        // 4. Fee Collection by Month
        $feeCollectionByMonth = Payment::select(
            DB::raw("DATE_FORMAT(due_date, '%b') as month_name"),
            DB::raw("DATE_FORMAT(due_date, '%m') as month_num"),
            DB::raw("sum(case when status = 'paid' then amount else 0 end) as collected"),
            DB::raw("sum(case when status != 'paid' then amount else 0 end) as pending")
        )
            ->whereBetween('due_date', [$startDate, $endDate])
            ->groupBy('month_name', 'month_num')
            ->orderBy('month_num')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month_name,
                    'collected' => (float)$item->collected,
                    'pending' => (float)$item->pending,
                ];
            });

        // 5. Activity Logs
        $activityLogs = ActivityLog::with('user')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user->name ?? 'System',
                    'action' => $log->action,
                    'timestamp' => $log->created_at->format('M j, Y - g:i A'),
                ];
            });

        return $this->success('Reports received successfully!', [
            'stats' => $stats,
            'attendanceTrend' => $attendanceTrend,
            'performanceBySubject' => $performanceBySubject,
            'feeCollectionByMonth' => $feeCollectionByMonth,
            'activityLogs' => $activityLogs,
        ], 200);
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->get('start_date', '2026-01-01');
        $endDate = $request->get('end_date', now()->toDateString());
        $filename = "system-report-{$startDate}-to-{$endDate}.pdf";

        $pdfContent = "%PDF-1.4 Report from {$startDate} to {$endDate}";

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function exportExcel(Request $request)
    {
        $startDate = $request->get('start_date', '2026-01-01');
        $endDate = $request->get('end_date', now()->toDateString());

        $filename = "system-report-{$startDate}-to-{$endDate}.csv";
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($startDate, $endDate) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Payment ID', 'Due Date', 'Status', 'Amount']);

            Payment::whereBetween('due_date', [$startDate, $endDate])
                ->chunk(100, function ($payments) use ($file) {
                    foreach ($payments as $payment) {
                        fputcsv($file, [
                            $payment->id,
                            $payment->due_date,
                            $payment->status,
                            '$' . $payment->amount
                        ]);
                    }
                });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
