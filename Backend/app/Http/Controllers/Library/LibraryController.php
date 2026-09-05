<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Book_issues;
use App\Models\BookCategory;
use App\Models\Books;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    public function getReturnBook(){
        
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $countBooksCategory = BookCategory::count();
        $countBooks         = Books::count();
        $countBorrowBooks   = Book_issues::where('status', 'borrowed')->count();
        $countReturnBacks   = Book_issues::where('status', 'returned')->count();

        return $this->success('Dashboard statistics retrieved successfully!', [
            'total_categories'     => $countBooksCategory,
            'total_books'          => $countBooks,
            'total_borrowed_books' => $countBorrowBooks,
            'total_returned_books' => $countReturnBacks,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
