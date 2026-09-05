<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Books extends Model
{
    use HasFactory;

    protected $appends = ['book_image_url'];

    protected $fillable = [
        'book_category_id',
        'title',
        'author',
        'isbn',
        'book_image',
        'total_copies',
        'available_copies'
    ];

    public function bookIssues()
    {
        return $this->hasMany(Book_issues::class);
    }

    public function category()
    {
        return $this->belongsTo(BookCategory::class,'book_category_id');
    }


    public function getBookImageUrlAttribute()
    {
        if (!empty($this->book_image)) {
           return url('storage/' . $this->book_image);
    }
        return null;
    }
}
