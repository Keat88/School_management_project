import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f19] text-gray-400 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">   
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Edumaster</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Empowering learners worldwide with expert-led online courses. Advance your career, learn at your own pace, and unlock your true potential.
            </p>
            <div className="flex space-x-3 pt-2">
              {['f', 't', 'in', 'ig'].map((social, idx) => (
                <a 
                  key={idx} 
                  href={`#${social}`} 
                  className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:bg-purple-600 hover:border-purple-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                >
                  <span className="text-xs uppercase font-bold">{social}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/courses" className="hover:text-purple-400 transition">All Courses</a></li>
              <li><a href="/instructors" className="hover:text-purple-400 transition">Instructors</a></li>
              <li><a href="/categories" className="hover:text-purple-400 transition">Categories</a></li>
              <li><a href="/about" className="hover:text-purple-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/categories/development" className="hover:text-purple-400 transition">Development</a></li>
              <li><a href="/categories/business" className="hover:text-purple-400 transition">Business</a></li>
              <li><a href="/categories/design" className="hover:text-purple-400 transition">Design</a></li>
              <li><a href="/categories/marketing" className="hover:text-purple-400 transition">Marketing</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Get the latest news and course updates straight to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-2.5 rounded-xl transition shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Edumaster. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-400 transition">Terms of Service</a>
            <a href="/cookies" className="hover:text-gray-400 transition">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}