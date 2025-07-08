import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    const typeText = () => {
      const currentWord = rotatingTexts[currentText];
      setIsTyping(true);
      setDisplayedText('');
      
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= currentWord.length) {
          setDisplayedText(currentWord.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Wait 2 seconds before moving to next word
          setTimeout(() => {
            setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
          }, 2000);
        }
      }, 150); // Speed of typing (150ms per character)
    };

    typeText();
  }, [currentText]);

  return (
    <>
      {/* Google Fonts Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      
      <section className="relative min-h-screen bg-[#070808] overflow-hidden">
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

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto min-h-screen">
            
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-[#070808]/80 backdrop-blur-sm border border-[#0a0a0a] rounded-full text-sm text-[#d4af37] font-medium shadow-sm">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-2 animate-pulse"></span>
                New AR Try-On Experience
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Redefine Your{' '}
                <span className="relative inline-block">
                  <span 
                    className="text-[#d4af37] relative"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic'
                    }}
                  >
                    {displayedText}
                    {isTyping && (
                      <span className="animate-pulse text-[#d4af37] ml-1">|</span>
                    )}
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#d4af37] rounded-full transform scale-x-0 animate-pulse"></div>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Premium eyewear designed for the modern generation. 
                <span className="text-[#d4af37] font-semibold"> Student discounts available</span> — 
                because great vision shouldn't break the bank.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
        
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#try-on" className="group relative bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <span className="relative z-10">Try Virtual Fitting</span>
                  <div className="absolute inset-0 bg-[#d4af37]/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="#collections" className="group border-2 border-[#0a0a0a] hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#070808]">
                  Browse Collection
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[#d4af37] rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-8 h-8 bg-[#d4af37]/90 rounded-full border-2 border-[#070808] shadow-sm"></div>
                    <div className="w-8 h-8 bg-[#d4af37]/80 rounded-full border-2 border-[#070808] shadow-sm"></div>
                  </div>
                  <span className="text-sm">10K+ happy customers</span>
                </div>
                <div className="text-sm">
                  <span className="text-[#d4af37] font-semibold">4.9/5</span> rating
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative">
                {/* Main image container */}
                <div className="relative bg-[#070808]/60 backdrop-blur-sm border border-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="EEu.png"
                    alt="Modern Eyewear Collection"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                  />
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}