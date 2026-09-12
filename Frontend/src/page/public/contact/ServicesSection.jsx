import React from 'react';

export default function ServicesSection() {
  const services = [
    {
      title: "Team Accounts",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-rose-500",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: "API Reference",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-amber-400",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: "Customer Support",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-orange-500",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Email Marketing",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-teal-400",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Digital Agency",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-purple-600",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Secure Hosting",
      description: "There are many variations passages of Lorem Ipsum majority some by words, if you are intending to use.",
      iconBg: "bg-blue-500",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-gray-50/60 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Intro Block */}
        <div className="lg:col-span-1 space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-0.5 bg-rose-500"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Providing solutions of every kind
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            In a professional context it often happens that private or corporate clients order a publication to publish news.
          </p>
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl transition-transform hover:-translate-y-0.5 p-8 shadow-sm border border-gray-100 flex flex-col justify-between space-y-6 hover:shadow-md duration-300"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-md`}>
                  {service.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div>
                <a 
                  href="#learn-more" 
                  className="inline-flex items-center text-xs font-bold text-gray-900 hover:text-rose-500 transition-colors group"
                >
                  <span>Learn More</span>
                  <span className="ml-1 text-rose-500 transform group-hover:translate-x-1 transition-transform">›</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}