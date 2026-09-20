import React from "react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen font-sans transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden pb-24 pt-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://i.pinimg.com/736x/79/ce/d2/79ced2f05291501d54611e056b58bda7.jpg"
            alt="Support team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 pt-8 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Contact us
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
            Kassapay is ready to provide the right solution according to your
            needs
          </p>
        </div>
      </div>

      {/* Main Contact Card Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 transition-colors duration-300">
          {/* Left Column: Get in touch info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Get in touch
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                Sociosqu viverra lectus placerat sem efficitur molestie vehicula
                cubilia leo etiam nam.
              </p>
            </div>

            <div className="space-y-6">
              {/* Head Office */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Head Office
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                    32,Street 58P,Sen Sok
                    <br />
                    Phnom Penh,Cambodia
                  </p>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Email Us
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                    support@yourdomain.tld
                    <br />
                    Keatkeng88@gmail.com
                  </p>
                </div>
              </div>

              {/* Call Us */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Call Us
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                    Phone : +885965757413
                    <br />
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-gray-950 dark:text-white">
                Follow our social media
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    name: "facebook",
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M24 12.07C24 5.66 18.63.28 12 .28S0 5.66 0 12.07c0 5.8 4.39 10.6 10.13 11.45v-8.1H7.08v-3.35h3.05V9.41c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87v2.24h3.32l-.53 3.35h-2.79v8.1C19.61 22.67 24 17.87 24 12.07z"
                          fill="#1877F2"
                        />
                      </svg>
                    ),
                  },
                  {
                    name: "instagram",
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient
                            id="igGradient"
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#FFDC80" />
                            <stop offset="20%" stopColor="#FCAF45" />
                            <stop offset="40%" stopColor="#F77737" />
                            <stop offset="60%" stopColor="#F56040" />
                            <stop offset="80%" stopColor="#C13584" />
                            <stop offset="100%" stopColor="#833AB4" />
                          </linearGradient>
                        </defs>
                        <rect
                          x="1"
                          y="1"
                          width="22"
                          height="22"
                          rx="6"
                          fill="url(#igGradient)"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="5"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="1.8"
                        />
                        <circle cx="18" cy="6" r="1.3" fill="#fff" />
                      </svg>
                    ),
                  },
                  {
                    name: "youtube",
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z"
                          fill="#FF0000"
                        />
                        <path d="M9.6 15.6V8.4L15.8 12l-6.2 3.6z" fill="#fff" />
                      </svg>
                    ),
                  },
                  {
                    name: "tiktok",
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M16.6 5.82a4.28 4.28 0 0 1-3.15-1.4V4.4h-3.1v13.62a2.6 2.6 0 1 1-1.83-2.48v-3.16a5.75 5.75 0 1 0 4.9 5.68V9.7a7.36 7.36 0 0 0 4.3 1.38V8a4.28 4.28 0 0 1-1.12-.14V5.82h-.0z"
                          fill="#000"
                        />
                        <path
                          d="M16.6 5.82a4.28 4.28 0 0 0 3.9 2.32v2.94a7.36 7.36 0 0 1-4.3-1.38v6.36a5.75 5.75 0 1 1-4.9-5.68v3.16a2.6 2.6 0 1 0 1.83 2.48V4.4h3.1v.02a4.28 4.28 0 0 0 .37 1.4z"
                          fill="#EE1D52"
                          opacity="0.85"
                        />
                        <path
                          d="M13.45 4.4h3.1v1.42a4.28 4.28 0 0 1-.37-1.4V4.4z"
                          fill="#69C9D0"
                          opacity="0.7"
                        />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={`#${social.name}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send us a message form */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Send us a message
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Phone"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition resize-none"
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

        {/* Map Section */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden h-96 relative transition-colors duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.448625776316!2d104.88799717481712!3d11.562211988638346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951adb4d4041d%3A0x8a90e729f62ad800!2sETEC%20Center!5e1!3m2!1sen!2skh!4v1789192572269!5m2!1sen!2skh"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>

          {/* Map Pin Mockup Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 animate-bounce pointer-events-auto">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              <span className="text-xs">Head Office Location</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}