<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Library\BookIssureResource;
use App\Models\Book_issues;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookIssureController extends Controller
{
    public function GetReturnBook(Request $request)
    {
        try {
            $query = Book_issues::with(['book', 'student'])->where('status', '');

            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('issue_date', [$request->start_date, $request->end_date]);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('status', 'like', "%{$search}%")
                        ->orWhereHas('book', function ($bookQuery) use ($search) {
                            $bookQuery->where('title', 'like', "%{$search}%");
                        })
                        ->orWhereHas('student', function ($studentQuery) use ($search) {
                            $studentQuery->where('student_name', 'like', "%{$search}%");
                        });
                });
            }

            $issues = $query->orderBy('created_at', 'desc')->get();

            if ($issues->isEmpty()) {
                return $this->error('No book issues found', null, 404);
            }

            return $this->success('Book issues retrieved successfully!', BookIssureResource::collection($issues));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving book issues', $e->getMessage(), 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Book_issues::with(['book', 'student']);

            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('issue_date', [$request->start_date, $request->end_date]);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('status', 'like', "%{$search}%")
                        ->orWhereHas('book', function ($bookQuery) use ($search) {
                            $bookQuery->where('title', 'like', "%{$search}%");
                        })
                        ->orWhereHas('student', function ($studentQuery) use ($search) {
                            $studentQuery->where('student_name', 'like', "%{$search}%");
                        });
                });
            }

            $issues = $query->orderBy('created_at', 'desc')->get();

            if ($issues->isEmpty()) {
                return $this->error('No book issues found', null, 404);
            }

            return $this->success('Book issues retrieved successfully!', BookIssureResource::collection($issues));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving book issues', $e->getMessage(), 500);
        }
    }
    // for return back book
    public function returnBook(Request $request, string $id)
    {
        try {
            $bookIssue = Book_issues::with(['book', 'student'])->find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }
            $validator = Validator::make($request->all(), [
                'return_date' => 'required|date',
            ]);
            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }
            $bookIssue->update([
                'return_date' => $request->return_date,
                'status'      => 'returned',
            ]);

            return $this->success('Book returned successfully!', new BookIssureResource($bookIssue), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while returning the book', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id'    => 'required|exists:books,id',
            'student_id' => 'required|exists:students,id',
            'issue_date' => 'required|date',
            'due_date'   => 'required|date|after_or_equal:issue_date',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $bookIssue = Book_issues::create([
                'book_id'    => $request->book_id,
                'student_id' => $request->student_id,
                'issue_date' => $request->issue_date,
                'due_date'   => $request->due_date,
                'status'     => 'borrowed',
            ]);

            $bookIssue->load(['book', 'student']);

            return $this->success('Book borrowed successfully!', new BookIssureResource($bookIssue), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while issuing the book', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $bookIssue = Book_issues::with(['book', 'student'])->find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }

            return $this->success('Book issue have been found!!', new BookIssureResource($bookIssue), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the book issue record', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $bookIssue = Book_issues::with(['book', 'student'])->find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'book_id'    => 'required|exists:books,id',
                'student_id' => 'required|exists:students,id',
                'issue_date' => 'required|date',
                'due_date'   => 'required|date|after_or_equal:issue_date',
            ]);
            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }
            $status = $bookIssue->status;

            $bookIssue->update([
                'book_id'    => $request->book_id,
                'student_id' => $request->student_id,
                'issue_date' => $request->issue_date,
                'due_date'   => $request->due_date,
                'status'     => $status,
            ]);

            $bookIssue->load(['book', 'student']);

            return $this->success('Book borrowed update successfully!', new BookIssureResource($bookIssue), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the book issue record', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $bookIssue = Book_issues::find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }

            $bookIssue->delete();

            return $this->success('Book issue record deleted successfully!', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the book issue record', $e->getMessage(), 500);
        }
    }
}
