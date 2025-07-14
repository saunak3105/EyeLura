import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#070808] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
      <div className="absolute top-8 right-12 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-12 left-12 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl"></div>
      
      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-[#1a1a1a] py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            <div className="text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#d4af37] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Stay in Focus
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                Get exclusive deals, new arrivals, and student discounts delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-6 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                />
                <button className="bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-4xl font-bold text-[#d4af37] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                EyeLura
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                Redefining eyewear for the modern generation. Premium quality, affordable prices, and cutting-edge virtual try-on technology.
              </p>
              
              {/* Social Media */}
              <div className="space-y-6">
                <h4 className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Follow Our Journey</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a] hover:border-[#d4af37] hover:bg-[#1a1a1a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37] text-lg">📷</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a] hover:border-[#d4af37] hover:bg-[#1a1a1a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37] text-lg">👥</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a] hover:border-[#d4af37] hover:bg-[#1a1a1a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37] text-lg">🐦</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a] hover:border-[#d4af37] hover:bg-[#1a1a1a] transition-all duration-300 group">
                    <span className="text-gray-400 group-hover:text-[#d4af37] text-lg">💼</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
                Shop
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li><a href="/shop" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>All Collections</a></li>
                <li><a href="/shop?category=new" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>New Arrivals</a></li>
                <li><a href="/shop?category=bestsellers" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Best Sellers</a></li>
                <li><a href="#try-on" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Virtual Try-On</a></li>
                <li><a href="/shop?category=limited" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Limited Editions</a></li>
              </ul>
            </div>

            {/* Students & Deals */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
                Students & Deals
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li><a href="/student-discount" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Student Discount</a></li>
                <li><a href="/offers" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>First-Time Buyer</a></li>
                <li><a href="/prescription-deals" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Prescription Deals</a></li>
                <li><a href="/bulk-orders" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Bulk Orders</a></li>
                <li><a href="/referral" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Referral Program</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
                Support
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#d4af37] rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li><a href="/contact" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>About Us</a></li>
                <li><a href="/size-guide" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Size Guide</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Shipping & Returns</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-[#d4af37] transition-colors duration-300 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#1a1a1a] py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-gray-400 text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                © 2025 EyeLura. Crafted with passion for clear vision.
              </div>
              <div className="flex flex-wrap items-center gap-6 text-base">
                <a href="/privacy" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="/terms" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="/accessibility" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}