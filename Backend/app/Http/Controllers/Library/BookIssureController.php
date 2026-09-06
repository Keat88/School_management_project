<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Library\BookIssureResource;
use App\Models\Book_issues;
use App\Models\Books;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookIssureController extends Controller
{
    public function getStudentStats(Request $request)
    {
        try {
            $query = Book_issues::query()
                ->join('students', 'book_issues.student_id', '=', 'students.id')
                ->select(
                    'students.id as student_id',
                    'students.student_name',
                    DB::raw('COUNT(book_issues.id) as total_borrowed'),
                    DB::raw("SUM(CASE WHEN book_issues.status = 'returned' THEN 1 ELSE 0 END) as total_returned"),
                    DB::raw('COUNT(DISTINCT book_issues.issue_date) as library_visits')
                )
                ->groupBy('students.id', 'students.student_name');

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where('students.student_name', 'like', "%{$search}%");
            }

            // Sort by library visits descending by default to show top visitors first
            $sortBy = $request->input('sort_by', 'library_visits');
            $sortOrder = $request->input('sort_order', 'desc');

            if (in_array($sortBy, ['library_visits', 'total_borrowed', 'total_returned', 'student_name'])) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('library_visits', 'desc');
            }

            $perPage = $request->input('per_page', 10);
            $stats = $query->paginate($perPage);

            return $this->success('Student stats retrieved successfully!', $stats, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving student statistics', $e->getMessage(), 500);
        }
    }


    public function GetReturnBook(Request $request)
    {
        try {
            $query = Book_issues::with(['book', 'student'])->where('status', 'borrowed');

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
            $perPage = $request->input('per_page', 10);
            $issues = $query->orderBy('created_at', 'desc')->paginate($perPage);

            if ($issues->isEmpty()) {
                return $this->success('Book issues retrieved successfully!', [
                    'data' => [],
                    'current_page' => $issues->currentPage(),
                    'per_page' => $issues->perPage(),
                    'total' => $issues->total(),
                ]);
            }

            return $this->success(
                'Book issues retrieved successfully!',
                BookIssureResource::collection($issues)->response()->getData(true)
            );
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

            $perPage = $request->input('per_page', 10);
            $issues = $query->orderBy('created_at', 'desc')->paginate($perPage);

            if ($issues->isEmpty()) {
                return $this->success('Book issues retrieved successfully!', [
                    'data' => [],
                    'current_page' => $issues->currentPage(),
                    'per_page' => $issues->perPage(),
                    'total' => $issues->total(),
                ]);
            }

            return $this->success(
                'Book issues retrieved successfully!',
                BookIssureResource::collection($issues)->response()->getData(true)
            );
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving book issues', $e->getMessage(), 500);
        }
    }

    // For returning a borrowed book
    public function returnBook(Request $request, string $id)
    {
        try {
            $bookIssue = Book_issues::with(['book', 'student'])->find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }

            if ($bookIssue->status === 'returned') {
                return $this->error('This book has already been returned.', null, 400);
            }

            $validator = Validator::make($request->all(), [
                'return_date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            DB::transaction(function () use ($request, $bookIssue) {
                $bookIssue->update([
                    'return_date' => $request->return_date,
                    'status'      => 'returned',
                ]);

                if ($bookIssue->book) {
                    $bookIssue->book->increment('available_copies');
                }
            });

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
            $book = Books::find($request->book_id);
            if ($book->available_copies <= 0) {
                return $this->error('No available copies left for this book.', null, 400);
            }

            $bookIssue = DB::transaction(function () use ($request, $book) {
                $issue = Book_issues::create([
                    'book_id'    => $request->book_id,
                    'student_id' => $request->student_id,
                    'issue_date' => $request->issue_date,
                    'due_date'   => $request->due_date,
                    'status'     => 'borrowed',
                ]);

                $book->decrement('available_copies');
                return $issue;
            });

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
            $bookIssue = Book_issues::with('book')->find($id);

            if (!$bookIssue) {
                return $this->error('Book issue record not found!', null, 404);
            }

            DB::transaction(function () use ($bookIssue) {
                // Restore available copies if deleting an unreturned book issue
                if ($bookIssue->status === 'borrowed' && $bookIssue->book) {
                    $bookIssue->book->increment('available_copies');
                }

                $bookIssue->delete();
            });

            return $this->success('Book issue record deleted successfully!', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the book issue record', $e->getMessage(), 500);
        }
    }
}
