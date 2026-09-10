<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class PaymentController extends Controller
{
    public function index(Request $request)
    {
        // 1. Calculate overall stats across all records (for summary cards)
        $allPayments = Payment::all();
        $totalRevenue = $allPayments->sum('amount');
        $totalPaid = $allPayments->where('status', 'paid')->sum('amount');
        $totalPending = $allPayments->where('status', 'pending')->sum('amount');
        $totalOverdue = $allPayments->where('status', 'overdue')->sum('amount');

        // 2. Build filtered query for the table list
        $query = Payment::with('student');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // 3. Add pagination (defaults to 10 items per page, configurable via ?per_page=15)
        $perPage = $request->get('per_page', 10);
        $paginatedPayments = $query->latest()->paginate($perPage);

        // PaymentResource::collection automatically includes pagination meta/links
        return PaymentResource::collection($paginatedPayments)->additional([
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalPaid' => $totalPaid,
                'totalPending' => $totalPending,
                'totalOverdue' => $totalOverdue,
            ],
        ]);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'category'   => 'required|in:tuition,dormitory,course',
            'amount'     => 'required|numeric|min:0',
            'due_date'   => 'required|date',
            'method'     => 'nullable|string',
            'status'     => 'required|in:paid,pending,overdue',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid data', 'errors' => $validator->errors()], 422);
        }

        try {
            $payment = Payment::create($request->all());
            return response()->json([
                'message' => 'Payment created successfully',
                'data'    => new PaymentResource($payment)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $payment = Payment::with('student')->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        return new PaymentResource($payment);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_id' => 'sometimes|exists:students,id',
            'category'   => 'sometimes|in:tuition,dormitory,course',
            'amount'     => 'sometimes|numeric|min:0',
            'due_date'   => 'sometimes|date',
            'method'     => 'nullable|string',
            'status'     => 'sometimes|in:paid,pending,overdue',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid data', 'errors' => $validator->errors()], 422);
        }

        try {
            $payment->update($request->all());
            return response()->json([
                'message' => 'Payment updated successfully',
                'data'    => new PaymentResource($payment)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
