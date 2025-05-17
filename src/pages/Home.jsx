"use client"

import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNDIzMkQiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMzBoMzB2MzBIMHoiIGZpbGw9IiMwQTEwMUYiLz48cGF0aCBkPSJNMzAgMGgzMHYzMEgzMHpNMCAwaDMwdjMwSDB6IiBmaWxsPSIjMEExMDFGIi8+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSIjMEExMDFGIi8+PC9nPjwvc3ZnPg==')] opacity-20 z-0"></div>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Hero Content */}
            <div className="md:w-1/2 text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                The Future of Tech Community
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  TechNest
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl">
                Connect with tech enthusiasts, share your knowledge, and discover the latest innovations in the world of
                technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/explore"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="md:w-1/2 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-gray-800 p-2 rounded-2xl border border-gray-700">
                <img
                  src="https://t4.ftcdn.net/jpg/06/95/05/51/360_F_695055160_oBrk5j3u2rNiSwDAGdZiULAKcM3sN9ZN.jpg"
                  alt="TechNest Platform"
                  className="w-full h-auto rounded-xl"
                />
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-cyan-500 p-3 rounded-xl shadow-lg transform rotate-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-600 p-3 rounded-xl shadow-lg transform -rotate-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose TechNest?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover a platform designed for tech enthusiasts to connect, share, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Community Driven</h3>
            <p className="text-gray-400">
              Connect with like-minded tech enthusiasts and build your professional network.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Knowledge Sharing</h3>
            <p className="text-gray-400">
              Share your expertise and learn from others through posts, discussions, and resources.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Innovation Hub</h3>
            <p className="text-gray-400">
              Stay updated with the latest tech trends, tools, and innovations in the industry.
            </p>
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNDIzMkQiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMzBoMzB2MzBIMHoiIGZpbGw9IiMwQTEwMUYiLz48cGF0aCBkPSJNMzAgMGgzMHYzMEgzMHpNMCAwaDMwdjMwSDB6IiBmaWxsPSIjMEExMDFGIi8+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSIjMEExMDFGIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

          <div className="relative py-16 px-8 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Tech Community?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Start sharing your knowledge, connecting with other tech enthusiasts, and growing your professional
              network today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
              >
                Sign Up Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-cyan-400">TechNest</h2>
              <p className="text-gray-400 mt-2">Connect. Share. Innovate.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                About
              </Link>
              <Link to="/features" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Features
              </Link>
              <Link to="/community" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Community
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TechNest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
