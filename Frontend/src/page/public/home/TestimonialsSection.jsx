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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50/50">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
          What Our Students Say
        </h2>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col justify-between transition hover:shadow-md"
          >
            <div>
              {/* Quote Icon */}
              <div className="text-purple-600 text-4xl font-serif leading-none mb-3">
                “
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                {item.quote}
              </p>
            </div>

            {/* Author Info & Rating */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-400">{item.role}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex text-amber-400 space-x-0.5">
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
        <span className="w-6 h-2 bg-purple-600 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
      </div>
    </section>
  );
}