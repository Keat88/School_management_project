<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Orders::with(['user', 'enrollments.course']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric|min:0',
            'payment_status' => 'sometimes|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|max:100',
            'transaction_id' => 'nullable|string|max:100',
        ]);
        $order = Orders::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Order created successfully',
            'data' => $order->load(['user', 'enrollments']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Orders $orders)
    {
        $orders->load(['user', 'enrollments.course']);

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orders $orders)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'total_amount' => 'sometimes|numeric|min:0',
            'payment_status' => 'sometimes|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|max:100',
            'transaction_id' => 'nullable|string|max:100',
        ]);

        $orders->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Order updated successfully',
            'data' => $orders->load(['user', 'enrollments']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orders $orders)
    {
        $orders->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Order deleted successfully',
        ]);
    }
}
