import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Edumaster has completely changed my career path. The courses are practical, well-structured, and easy to follow.",
      name: "Sarah Johnson",
      role: "Web Developer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
    {
      quote: "The instructors are amazing and the support team is always there to help. Highly recommended!",
      name: "Michael Chen",
      role: "UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      quote: "I learned so much and was able to apply it immediately in my job. Worth every penny!",
      name: "David Williams",
      role: "Digital Marketer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
          Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
          What Our Students Say
        </h2>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div 
            key={index} 
            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between transition hover:shadow-md ${
              index === 2 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div>
              {/* Quote Icon */}
              <div className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl font-serif leading-none mb-3">
                “
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                {item.quote}
              </p>
            </div>

            {/* Author Info & Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 gap-4 sm:gap-2">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-slate-400 truncate">{item.role}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex text-amber-400 space-x-0.5 self-start sm:self-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.690h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.690l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center space-x-2 mt-8">
        <span className="w-6 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-300 dark:bg-slate-700 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-300 dark:bg-slate-700 rounded-full"></span>
      </div>
    </section>
  );
}