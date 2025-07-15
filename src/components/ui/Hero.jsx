import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const texts = ['Clarity', 'Vision', 'Style', 'Elegance'];
  const staticText = 'Meets ';
  const fullText = 'Clarity Meets Elegance';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const currentWord = texts[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      } else {
        setCurrentText(prev => 
          isDeleting 
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#d4af37] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Main Headline with Typewriter Effect */}
        <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="inline-block">
              {currentText}
            </span>
            <span className="text-white"> {staticText}</span>
            <span className="text-[#d4af37] font-normal">Elegance</span>
            <span className="inline-block w-1 h-16 md:h-20 lg:h-24 bg-[#d4af37] ml-2 animate-pulse"></span>
          </h1>
        </div>

        {/* Subtext */}
        <div className={`mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed tracking-wide max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
            Discover premium eyewear crafted for the modern connoisseur
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <a 
            href="/shop" 
            className="group relative bg-[#d4af37] hover:bg-[#e6c14d] text-black px-10 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#c9a42f] to-[#d4af37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
          
          <a 
            href="#collections" 
            className="group border border-gray-600 hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-10 py-4 text-lg font-medium transition-all duration-300 backdrop-blur-sm hover:bg-[#d4af37]/10"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}
          >
            <span>Discover More</span>
            <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>

        {/* Minimal Social Proof */}
        <div className={`mt-16 flex items-center justify-center gap-8 text-gray-500 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-[#d4af37] rounded-full border-2 border-black"></div>
              <div className="w-8 h-8 bg-[#d4af37]/80 rounded-full border-2 border-black"></div>
              <div className="w-8 h-8 bg-[#d4af37]/60 rounded-full border-2 border-black"></div>
            </div>
            <span className="text-sm font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>Trusted by 10K+</span>
          </div>
          <div className="text-sm font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
            <span className="text-[#d4af37]">4.9/5</span> Excellence
          </div>
        </div>
      </div>
    </section>
  );
}