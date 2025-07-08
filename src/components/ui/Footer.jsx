import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#070808] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
      <div className="absolute top-4 right-8 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl"></div>
      
      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-[#0a0a0a] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
                Stay in Focus
              </h2>
              <p className="text-gray-400 mb-6">
                Get exclusive deals, new arrivals, and student discounts delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-[#070808] border border-[#0a0a0a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300 text-white"
                />
                <button className="bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
                EyeLura
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Redefining eyewear for the modern generation. Premium quality, affordable prices, and cutting-edge virtual try-on technology.
              </p>
              
              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-[#070808] rounded-full flex items-center justify-center border border-[#0a0a0a] hover:border-[#d4af37] hover:bg-[#0a0a0a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37]">📷</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#070808] rounded-full flex items-center justify-center border border-[#0a0a0a] hover:border-[#d4af37] hover:bg-[#0a0a0a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37]">👥</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#070808] rounded-full flex items-center justify-center border border-[#0a0a0a] hover:border-[#d4af37] hover:bg-[#0a0a0a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37]">🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#070808] rounded-full flex items-center justify-center border border-[#0a0a0a] hover:border-[#d4af37] hover:bg-[#0a0a0a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37]">💼</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 relative">
                Shop
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Collections
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">New Arrivals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Best Sellers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Virtual Try-On</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Limited Editions</a></li>
              </ul>
            </div>

            {/* Students & Deals */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 relative">
                Students & Deals
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Student Discount</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">First-Time Buyer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Prescription Deals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Bulk Orders</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Referral Program</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 relative">
                Support
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Size Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Prescription Help</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Shipping & Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Warranty</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#0a0a0a] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2025 EyeLura. Crafted with passion for clear vision.
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}