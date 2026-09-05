<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Library\BookCategoryResource;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = BookCategory::query();
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where('book_category', 'like', "%{$search}%");
            }
            $perPage = $request->input('per_page', 10);
            $categories = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Check if the paginated collection is empty
            if ($categories->isEmpty()) {
                return $this->error('Book categories don\'t have data', null, 404);
            }

            return $this->success(
                'Book categories retrieved successfully!',
                BookCategoryResource::collection($categories)->response()->getData(true)
            );
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving book categories', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_category' => 'required|string|max:255|unique:book_categories,book_category'
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $bookCategory = BookCategory::create([
                'book_category' => $request->book_category
            ]);

            return $this->success('Book category created successfully!', new BookCategoryResource($bookCategory), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while storing the book category', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $bookCategory = BookCategory::with('books')->find($id);

            if (!$bookCategory) {
                return $this->error('Book category not found!', null, 404);
            }

            return $this->success('Book category found!', new BookCategoryResource($bookCategory), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the book category', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $bookCategory = BookCategory::find($id);

            if (!$bookCategory) {
                return $this->error('Book category not found!', null, 404);
            }

            $validator = Validator::make($request->all(), [
                'book_category' => 'sometimes|required|string|max:255|unique:book_categories,book_category,' . $id
            ]);

            if ($validator->fails()) {
                return $this->error('Invalid data', $validator->errors(), 422);
            }

            $bookCategory->update([
                'book_category' => $request->input('book_category', $bookCategory->book_category)
            ]);

            return $this->success('Book category updated successfully!', new BookCategoryResource($bookCategory), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the book category', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $bookCategory = BookCategory::find($id);

            if (!$bookCategory) {
                return $this->error('Book category not found!', null, 404);
            }

            $bookCategory->delete();

            return $this->success('Book category deleted successfully!', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the book category', $e->getMessage(), 500);
        }
    }
}
