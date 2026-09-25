<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Http\Resources\Library\BookResource;
use App\Models\Books;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary; // ប្រើប្រាស់ Cloudinary SDK

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Books::with('category');

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('author', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%");
                });
            }

            if ($request->has('isbn') && !empty($request->isbn)) {
                $isbn = $request->isbn;
                $query->where('isbn', 'like', "%{$isbn}%");
            }

            if ($request->has('category') && !empty($request->category)) {
                $category = $request->category;
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('book_category', 'like', "%{$category}%");
                });
            }
            $perPage = $request->input('per_page', 10);

            // Paginate results sorted by latest created date
            $books = $query->orderBy('created_at', 'desc')->paginate($perPage);

            if ($books->isEmpty()) {
                return $this->error('No books found', null, 404);
            }

            return $this->success(
                'Books retrieved successfully',
                BookResource::collection($books)->response()->getData(true)
            );
        } catch (\Exception $e) {
            return $this->error('Something went wrong while retrieving books', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_category_id' => 'required|exists:book_categories,id',
            'title'            => 'required|string|max:255',
            'author'           => 'required|string|max:255',
            'isbn'             => 'nullable|string|unique:books,isbn|max:255',
            'book_image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'total_copies'     => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $bookImage = null;
            if ($request->hasFile('book_image')) {
                $cloudinary = new Cloudinary();
                $uploadedFile = $cloudinary->uploadApi()->upload($request->file('book_image')->getRealPath());
                $bookImage = $uploadedFile['secure_url']; // ទទួលបាន Secure URL ពី Cloudinary
            }

            $book = Books::create([
                'book_category_id' => $request->book_category_id,
                'title'            => $request->title,
                'author'           => $request->author,
                'isbn'             => $request->isbn ?? null,
                'book_image'       => $bookImage,
                'total_copies'     => $request->total_copies,
                'available_copies' => $request->available_copies,
            ]);

            $book->load('category');

            return $this->success('Book created successfully', new BookResource($book), 201);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while creating the book', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $book = Books::with('category')->find($id);

            if (!$book) {
                return $this->error('Book not found', null, 404);
            }

            return $this->success('Book found successfully', new BookResource($book));
        } catch (\Exception $e) {
            return $this->error('Something went wrong while fetching the book', $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'book_category_id' => 'required|exists:book_categories,id',
            'title'            => 'required|string|max:255',
            'author'           => 'required|string|max:255',
            'isbn'             => 'nullable|string|max:255|unique:books,isbn,' . $id,
            'book_image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'total_copies'     => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
        ]);

        if ($validator->fails()) {
            return $this->error('Invalid data', $validator->errors(), 422);
        }

        try {
            $book = Books::find($id);

            if (!$book) {
                return $this->error('Book not found', null, 404);
            }

            $bookImage = $book->book_image;
            if ($request->hasFile('book_image')) {
                $cloudinary = new Cloudinary();
                $uploadedFile = $cloudinary->uploadApi()->upload($request->file('book_image')->getRealPath());
                $bookImage = $uploadedFile['secure_url'];
            }

            $book->update([
                'book_category_id' => $request->book_category_id,
                'title'            => $request->title,
                'author'           => $request->author,
                'isbn'             => $request->isbn ?? null,
                'book_image'       => $bookImage,
                'total_copies'     => $request->total_copies,
                'available_copies' => $request->available_copies,
            ]);

            $book->load('category');

            return $this->success('Book updated successfully', new BookResource($book), 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while updating the book', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $book = Books::find($id);

            if (!$book) {
                return $this->error('Book not found', null, 404);
            }
            $book->delete();

            return $this->success('Book deleted successfully', null, 200);
        } catch (\Exception $e) {
            return $this->error('Something went wrong while deleting the book', $e->getMessage(), 500);
        }
    }
}
