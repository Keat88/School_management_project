import React from 'react';

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Expert Instructors",
      description: "Learn from top industry professionals and experts.",
      iconBg: "bg-purple-600",
      svg: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    },
    {
      title: "Learn at Your Pace",
      description: "Access courses anytime, anywhere. Lifetime access.",
      iconBg: "bg-emerald-500",
      svg: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      title: "Certificates",
      description: "Earn recognized certificates to boost your career.",
      iconBg: "bg-amber-500",
      svg: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it from our support team.",
      iconBg: "bg-blue-600",
      svg: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50/50">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">
          Why Choose Us
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
          The Best Learning Experience
        </h2>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col justify-between duration-200 transition-transform hover:-translate-y-0.5  hover:shadow-md"
          >
            <div>
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} text-white flex items-center justify-center mb-6 shadow-md`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.svg} />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}