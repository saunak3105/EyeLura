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
      {/* Google Fonts Import - Better font selection */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
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
          <div className="max-w-7xl mx-auto">
            
            {/* Left-aligned Content Container */}
            <div className={`max-w-4xl space-y-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-[#070808]/80 backdrop-blur-sm border border-[#0a0a0a] rounded-full text-sm text-[#d4af37] font-medium shadow-lg">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                New AR Try-On Experience
              </div>

              {/* Main Headline with Clean Animation - Left Aligned */}
              <div className="space-y-8">
                <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: "'Crimson Text', serif" }}>
                  Redefine Your
                </h1>
                
                <div className="relative">
                  <h2 
                    className="text-6xl lg:text-8xl font-bold text-[#d4af37] transition-all duration-1000 ease-in-out"
                    style={{ 
                      fontFamily: "'Crimson Text', serif",
                      fontStyle: 'italic',
                      minHeight: '1.2em'
                    }}
                  >
                    {rotatingTexts[currentText]}
                  </h2>
                  <div className="absolute -bottom-4 left-0 w-3/4 h-1 bg-[#d4af37] rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Subheadline */}
              <div className="max-w-3xl space-y-6">
                <p className="text-2xl text-gray-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '400' }}>
                  Premium eyewear designed for the modern generation
                </p>
                <p className="text-lg text-gray-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-[#d4af37] font-semibold">Student discounts available</span> — 
                  because great vision shouldn't break the bank
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl py-8">
                <div className="text-center md:text-left space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>AR Try-On</h3>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Virtual fitting technology</p>
                </div>
                <div className="text-center md:text-left space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>Student Deals</h3>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Exclusive discounts</p>
                </div>
                <div className="text-center md:text-left space-y-3">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>Premium Quality</h3>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Crafted excellence</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <a href="#try-on" className="group relative bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  <span className="relative z-10">Try Virtual Fitting</span>
                  <div className="absolute inset-0 bg-[#d4af37]/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="/shop" className="group border-2 border-[#0a0a0a] hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#070808]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  Browse Collection
                  <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-8 pt-12 text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-[#d4af37] rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-10 h-10 bg-[#d4af37]/90 rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-10 h-10 bg-[#d4af37]/80 rounded-full border-2 border-[#070808] shadow-sm"></div>
                  </div>
                  <span className="text-base" style={{ fontFamily: "'Inter', sans-serif" }}>10K+ happy customers</span>
                </div>
                <div className="text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
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