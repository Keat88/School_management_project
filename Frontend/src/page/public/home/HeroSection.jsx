import React from 'react';

export default function HeroSection() {
  const categories = [
    { name: 'Development', courses: '1,250+ Courses', iconBg: 'bg-purple-100 text-purple-600', svg: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'Business', courses: '980+ Courses', iconBg: 'bg-green-100 text-green-600', svg: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Design', courses: '850+ Courses', iconBg: 'bg-pink-100 text-pink-600', svg: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { name: 'Marketing', courses: '760+ Courses', iconBg: 'bg-orange-100 text-orange-600', svg: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { name: 'Data Science', courses: '680+ Courses', iconBg: 'bg-indigo-100 text-indigo-600', svg: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
    { name: 'Personal Growth', courses: '590+ Courses', iconBg: 'bg-amber-100 text-amber-600', svg: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  ];

  const features = [
    { title: 'Expert Instructors', desc: 'Learn from industry experts', iconBg: 'bg-orange-100 text-orange-600', svg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Flexible Learning', desc: 'Study on your schedule', iconBg: 'bg-green-100 text-green-600', svg: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Certificate of Completion', desc: 'Boost your career', iconBg: 'bg-blue-100 text-blue-600', svg: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Lifetime Access', desc: 'Learn without limits', iconBg: 'bg-purple-100 text-purple-600', svg: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50/50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span>#1 Platform for Online Learning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Learn New Skills. <br />
              <span className="text-purple-600">Advance Your Future.</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-xl">
              Access 10,000+ online courses taught by industry experts. Learn at your pace. Anytime, anywhere.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="/courses" 
                className="bg-purple-600 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-purple-700 transition shadow-sm flex items-center space-x-2"
              >
                <span>Explore Courses</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>

              <a 
                href="#how-it-works" 
                className="border border-gray-200 bg-white text-gray-700 font-medium px-6 py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center space-x-2 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span>How It Works</span>
              </a>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="User" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="User" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="User" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="User" />
              </div>
              <div>
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.690h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.690l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Trusted by 50K+ learners worldwide</p>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration / Image with Floating Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl overflow-hidden shadow-xl bg-purple-50 border border-purple-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" 
                  alt="Student learning online" 
                  className="w-full h-[380px] object-cover object-center"
                />
              </div>

              <div className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-gray-100 space-y-3 w-64">
                {features.map((feat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${feat.iconBg} flex-shrink-0`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feat.svg}/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{feat.title}</h4>
                      <p className="text-[10px] text-gray-500">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories Section Card */}
        <div className="mt-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-900">Popular Categories</h3>
            <a href="/categories" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1 group">
              <span>View All Categories</span>
              <span className="group-hover:translate-x-1 transition">→</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <a 
                key={idx} 
                href={`/categories/${cat.name.toLowerCase()}`}
                className="group p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-purple-200 hover:shadow-md transition flex flex-col items-center text-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.svg}/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition">{cat.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.courses}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}