import React, { useState, useEffect } from 'react';
import { Camera, Smartphone, Eye, Zap, CheckCircle, Play } from 'lucide-react';

export default function TryOn() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Real-Time AR",
      description: "See frames instantly on your face"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Perfect Fit",
      description: "Virtual measurements for ideal sizing"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description: "Try multiple frames in seconds"
    }
  ];

  const benefits = [
    "Works on any device with camera",
    "No app download required",
    "Save & share your looks",
    "Compare multiple frames"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="try-on" className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#d4af37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#d4af37]/80 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/60 rounded-full blur-2xl"></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-gray-200 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-[#d4af37] font-medium shadow-sm">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-2 animate-pulse"></span>
                Revolutionary AR Technology
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Augmented Reality{' '}
                <span className="relative inline-block">
                  <span className="text-[#d4af37]">
                    Experience
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#d4af37] rounded-full transform scale-x-100 animate-pulse"></div>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Experience perfect fit visualization from the comfort of your space. 
                <span className="text-[#d4af37] font-semibold"> Try before you buy</span> — 
                no guesswork, just perfect frames.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-500 ${
                      activeFeature === index 
                        ? 'bg-[#d4af37] text-white shadow-lg transform scale-105' 
                        : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      activeFeature === index 
                        ? 'bg-white/20' 
                        : 'bg-[#d4af37] text-white'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{feature.title}</div>
                      <div className="text-xs opacity-80">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#" className="group relative bg-[#d4af37] hover:bg-[#e6c14d] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  <span className="relative z-10">Launch AR Experience</span>
                  <div className="absolute inset-0 bg-[#c9a42f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="#collections" className="group border-2 border-gray-300 hover:border-[#d4af37] text-gray-700 hover:text-[#d4af37] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#d4af37]/10 inline-flex items-center gap-3">
                  <Smartphone className="w-5 h-5" />
                  <span>View Demo</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-6 text-gray-500">
                <div className="text-sm">
                  <span className="text-[#d4af37] font-semibold">50K+</span> virtual try-ons
                </div>
                <div className="text-sm">
                  <span className="text-[#d4af37] font-semibold">98%</span> accuracy rate
                </div>
              </div>
            </div>

            {/* Right Content - AR Interface Demo */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative">
              
                {/* Main AR Interface Container */}
                <div className="relative bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden shadow-2xl p-8">
                  
                  {/* AR Camera Interface */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#d4af37]/10"></div>
                    
                    {/* Camera Frame */}
                    <div className="relative border-2 border-dashed border-[#d4af37] rounded-xl p-12 text-center">
                      <div className="text-6xl mb-4 animate-pulse">📱</div>
                      <h3 className="text-white font-semibold mb-2">AR Camera Interface</h3>
                      <p className="text-gray-300 text-sm mb-4">Point your camera to see frames on your face</p>
                      
                      {/* Scanning Animation */}
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 border-2 border-[#d4af37] rounded-full animate-ping"></div>
                        <div className="absolute inset-2 border-2 border-[#d4af37]/80 rounded-full animate-ping delay-500"></div>
                        <div className="absolute inset-4 bg-[#d4af37] rounded-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="text-[#d4af37] text-sm font-medium">Face Detection Active</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-3 gap-3">
                    <button className="bg-[#d4af37] text-white p-3 rounded-xl font-medium text-sm hover:bg-[#e6c14d] transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Capture
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 p-3 rounded-xl font-medium text-sm hover:bg-white transition-all duration-300 shadow-lg">
                      Gallery
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 p-3 rounded-xl font-medium text-sm hover:bg-white transition-all duration-300 shadow-lg">
                      Share
                    </button>
                  </div>

                  {/* Overlay elements */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-[#d4af37] text-sm font-medium shadow-lg">
                    AR Ready
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`text-center mt-20 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-600 font-medium shadow-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Works on all devices • No download required
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to experience the future of eyewear shopping?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've found their perfect frames using our AR technology.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-[#d4af37] rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-8 h-8 bg-[#d4af37]/80 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-8 h-8 bg-[#d4af37]/60 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <span className="text-sm">50K+ AR sessions completed</span>
              </div>
              <div className="text-sm">
                <span className="text-[#d4af37] font-semibold">4.8/5</span> user satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}