import React, { useState } from 'react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  const categories = ['All', 'Development', 'Business', 'Design', 'Marketing', 'Data Science'];

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      category: 'Development',
      instructor: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      rating: 4.8,
      reviewsCount: '12.5K',
      price: 59.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600',
      isFree: false,
    },
    {
      id: 2,
      title: 'UI/UX Masterclass: From Concept to Figma',
      category: 'Design',
      instructor: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.9,
      reviewsCount: '8.3K',
      price: 49.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600',
      isFree: false,
    },
    {
      id: 3,
      title: 'Advanced Python Programming & Data Science',
      category: 'Data Science',
      instructor: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
      rating: 4.7,
      reviewsCount: '6.1K',
      price: 0,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
      isFree: true,
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy & Social Media',
      category: 'Marketing',
      instructor: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rating: 4.6,
      reviewsCount: '4.2K',
      price: 39.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600',
      isFree: false,
    },
    {
      id: 5,
      title: 'Modern Business Management & Leadership',
      category: 'Business',
      instructor: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      reviewsCount: '9.0K',
      price: 69.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      isFree: false,
    },
    {
      id: 6,
      title: 'React & Next.js Complete Guide 2026',
      category: 'Development',
      instructor: 'Alex Turner',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
      rating: 5.0,
      reviewsCount: '15.2K',
      price: 74.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
      isFree: false,
    }
  ];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

    let matchesPrice = true;
    if (selectedPrice === 'Free') {
      matchesPrice = course.isFree;
    } else if (selectedPrice === 'Paid') {
      matchesPrice = !course.isFree;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 tracking-wider uppercase bg-purple-100 px-3 py-1.5 rounded-full">
            Our Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Discover professional online courses to elevate your skills and advance your career path.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search courses or instructors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Price Filter Dropdown */}
            <select 
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="bg-gray-50/50 border border-gray-200 text-gray-700 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 transition cursor-pointer"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free Courses</option>
              <option value="Paid">Paid Courses</option>
            </select>

          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-purple-200'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-purple-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-purple-100 group"
              >
                {/* Banner Image */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md">
                    {course.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex items-center space-x-2.5">
                      <img 
                        src={course.avatar} 
                        alt={course.instructor} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-gray-600">{course.instructor}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.690h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.690l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-800">{course.rating}</span>
                      <span className="text-xs text-gray-400 font-medium">({course.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Footer / Price & Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-baseline space-x-2">
                      {course.isFree ? (
                        <span className="text-xl font-extrabold text-emerald-600">Free</span>
                      ) : (
                        <>
                          <span className="text-xl font-extrabold text-gray-900">${course.price}</span>
                          <span className="text-sm font-medium text-gray-400 line-through">${course.originalPrice}</span>
                        </>
                      )}
                    </div>

                    <a 
                      href={`/courses/${course.id}`}
                      className="bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white font-medium text-xs px-4 py-2.5 rounded-xl transition"
                    >
                      Enroll Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No courses found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search query or filter criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}