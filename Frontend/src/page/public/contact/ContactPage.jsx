import React from 'react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* Header & Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden pb-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600" 
            alt="Support team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
        </div>

        {/* Navigation Bar */}
        <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              k
            </div>
            <span className="text-xl font-bold tracking-tight text-white">kassapay</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a href="#homepage" className="hover:text-white transition">Homepage</a>
            <a href="#about" className="hover:text-white transition">About us</a>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition">
              <span>Solutions</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <a href="#contact" className="text-white font-semibold">Contact us</a>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition">
              <span>Pages</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </nav>

          <div>
            <a 
              href="#started" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md transition"
            >
              Get Started
            </a>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 pt-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact us</h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
            Kassapay is ready to provide the right solution according to your needs
          </p>
        </div>
      </div>

      {/* Main Contact Card Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Get in touch info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Get in touch</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sociosqu viverra lectus placerat sem efficitur molestie vehicula cubilia leo etiam nam.
              </p>
            </div>

            <div className="space-y-6">
              {/* Head Office */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Head Office</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Jalan Cempaka Wangi No 22<br />Jakarta - Indonesia</p>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email Us</h4>
                  <p className="text-sm text-gray-500 mt-0.5">support@yourdomain.tld<br />hello@yourdomain.tld</p>
                </div>
              </div>

              {/* Call Us */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Call Us</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Phone : +6221.2002.2012<br />Fax : +6221.2002.2013</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-gray-950">Follow our social media</h4>
              <div className="flex space-x-3">
                {['f', 'ig', 't', 'in', 'yt'].map((social, idx) => (
                  <a 
                    key={idx} 
                    href={`#${social}`} 
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-md transition"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send us a message form */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Send us a message</h2>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
                  <input 
                    type="text" 
                    placeholder="Company" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <input 
                    type="text" 
                    placeholder="Phone" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="Message" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition text-sm"
              >
                Send
              </button>
            </form>
          </div>

        </div>

        {/* Map Mockup Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-96 relative">
          {/* Simulated Map View Background */}
          <div className="absolute inset-0 bg-blue-50/50 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400" 
              alt="Map view" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Map Pin Mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 animate-bounce">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <span className="text-xs">Head Office Location</span>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}