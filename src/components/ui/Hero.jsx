import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const rotatingTexts = [
    "Style",
    "Vision", 
    "Confidence",
    "Innovation",
    "Elegance",
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentText]);

  return (
    <>
      {/* Google Fonts Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />
      
      <section className="relative min-h-screen bg-[#070808] overflow-hidden flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-[#0a0a0a] animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-7xl mx-auto text-center">
            
            {/* Content Container */}
            <div className={`space-y-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-[#070808]/80 backdrop-blur-sm border border-[#0a0a0a] rounded-full text-sm text-[#d4af37] font-medium shadow-lg">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                New AR Try-On Experience
              </div>

              {/* Main Headline with Clean Animation */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Redefine Your
                </h1>
                
                <div className="relative inline-block">
                  <h2 
                    className="text-6xl lg:text-8xl font-bold text-[#d4af37] transition-all duration-1000 ease-in-out"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      minHeight: '1.2em'
                    }}
                  >
                    {rotatingTexts[currentText]}
                  </h2>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-[#d4af37] rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Subheadline */}
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl text-gray-300 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Premium eyewear designed for the modern generation
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  <span className="text-[#d4af37] font-semibold">Student discounts available</span> — 
                  because great vision shouldn't break the bank
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>AR Try-On</h3>
                  <p className="text-gray-400 text-sm">Virtual fitting technology</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Student Deals</h3>
                  <p className="text-gray-400 text-sm">Exclusive discounts</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Quality</h3>
                  <p className="text-gray-400 text-sm">Crafted excellence</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <a href="#try-on" className="group relative bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="relative z-10">Try Virtual Fitting</span>
                  <div className="absolute inset-0 bg-[#d4af37]/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="/shop" className="group border-2 border-[#0a0a0a] hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#070808]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Browse Collection
                  <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-8 pt-12 text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-[#d4af37] rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-10 h-10 bg-[#d4af37]/90 rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-10 h-10 bg-[#d4af37]/80 rounded-full border-2 border-[#070808] shadow-sm"></div>
                  </div>
                  <span className="text-base">10K+ happy customers</span>
                </div>
                <div className="text-base">
                  <span className="text-[#d4af37] font-semibold">4.9/5</span> rating
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}