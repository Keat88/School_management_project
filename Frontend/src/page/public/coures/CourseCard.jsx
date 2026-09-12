import React from 'react';

export default function CourseCard() {
  return (
    <div className="max-w-xs w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
      {/* Top Banner Image with Badge */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" 
          alt="Course Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-purple-600 text-white p-2.5 rounded-2xl shadow-md flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 leading-snug">
            Complete Web Development Bootcamp
          </h3>

          {/* Instructor */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" 
              alt="John Smith" 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-gray-600">John Smith</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1.5">
            <div className="flex text-amber-400">
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.690h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.690l1.07-3.292z"/>
                </svg>
              ))}
              <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.690h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.690l1.07-3.292z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-800">4.8</span>
            <span className="text-xs text-gray-400 font-medium">(12.5K)</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 pt-2 border-t border-gray-50">
          <span className="text-xl font-extrabold text-gray-900">$59.99</span>
          <span className="text-sm font-medium text-gray-400 line-through">$119.99</span>
        </div>
      </div>
    </div>
  );
}