import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useARTryOn } from '../../hooks/useARTryOn';
import ARTryOn from './ARTryOn';
import { 
  Camera, 
  Sparkles, 
  Eye, 
  Smartphone, 
  Monitor, 
  Zap, 
  Star, 
  Play,
  ArrowRight,
  Shield,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';

export default function TryOn() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { isAROpen, isARSupported, browserInfo, openAR, closeAR } = useARTryOn();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('try-on');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Real-Time Face Tracking',
      description: 'Advanced ML algorithms track 468 facial landmarks for precise glasses placement',
      gradient: 'from-blue-400 to-cyan-500',
      delay: 0.1
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Style Preview',
      description: 'See how different frames look on you with zero lag and perfect alignment',
      gradient: 'from-purple-400 to-pink-500',
      delay: 0.2
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'HD Photo Capture',
      description: 'Save high-quality photos to compare different styles and share with friends',
      gradient: 'from-green-400 to-emerald-500',
      delay: 0.3
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Cross-Device Compatible',
      description: 'Works seamlessly on desktop, tablet, and mobile devices',
      gradient: 'from-orange-400 to-red-500',
      delay: 0.4
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Users Tried AR' },
    { icon: <Award className="w-6 h-6" />, value: '98%', label: 'Accuracy Rate' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '4.9★', label: 'User Rating' },
    { icon: <Shield className="w-6 h-6" />, value: '100%', label: 'Privacy Safe' }
  ];

  const glassesPreview = [
    { id: 'classic', name: 'Classic', emoji: '👓', color: '#2c2c2c' },
    { id: 'aviator', name: 'Aviator', emoji: '🕶️', color: '#E8E8E8' },
    { id: 'round', name: 'Round', emoji: '⭕', color: '#8B4513' },
    { id: 'square', name: 'Square', emoji: '⬛', color: '#1a1a1a' },
    { id: 'cateye', name: 'Cat Eye', emoji: '😸', color: '#8B0000' }
  ];

  return (
    <section 
      id="try-on" 
      className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div 
            className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Badge */}
            <motion.div 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 rounded-full text-blue-400 font-semibold shadow-2xl mb-8"
              animate={{ 
                scale: [1, 1.05, 1], 
                y: [0, -5, 0],
                boxShadow: [
                  '0 10px 30px rgba(59, 130, 246, 0.3)',
                  '0 15px 40px rgba(59, 130, 246, 0.4)',
                  '0 10px 30px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 mr-3" />
              <span className="text-lg">Revolutionary AR Technology</span>
              <Star className="w-6 h-6 ml-3" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light text-white leading-tight mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
              Try Before You{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f0d666] to-[#d4af37] bg-clip-text text-transparent font-normal">
                  Buy
                </span>
                <motion.div 
                  className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-[#d4af37] via-[#f0d666] to-[#d4af37] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto mb-12" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
              Experience the future of eyewear shopping with our{' '}
              <span className="text-[#d4af37] font-medium">AI-powered virtual try-on</span>.
              <br />
              See how every frame looks on you in real-time with precision tracking.
            </p>

            {/* Enhanced CTA Section */}
            <div className="flex flex-col items-center gap-8">
              <motion.button
                onClick={openAR}
                disabled={!isARSupported}
                className={`group relative px-12 py-6 rounded-full text-xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-2xl ${
                  isARSupported
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f0d666] to-[#d4af37] hover:from-[#c9a030] hover:via-[#e6c14d] hover:to-[#c9a030] text-black'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                } overflow-hidden`}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                whileHover={isARSupported ? { scale: 1.05, y: -2 } : {}}
                whileTap={isARSupported ? { scale: 0.98 } : {}}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  {isARSupported ? 'Launch AR Try-On' : 'AR Not Supported'}
                  <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                {isARSupported && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b8962a] via-[#d4af37] to-[#b8962a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
              </motion.button>

              {/* Browser Compatibility Info */}
              {!isARSupported && browserInfo && (
                <motion.div
                  className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-6 max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Monitor className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-medium">Browser Compatibility</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your browser ({browserInfo.browser} {browserInfo.version}) may have limited AR support. 
                    For the best experience, please use Chrome 88+, Firefox 85+, or Safari 13+.
                  </p>
                </motion.div>
              )}

              {/* Quick Preview */}
              <motion.div
                className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-gray-400 text-sm font-light">Quick Preview:</span>
                <div className="flex gap-3">
                  {glassesPreview.slice(0, 3).map((style, index) => (
                    <motion.div
                      key={style.id}
                      className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border border-gray-600 hover:border-[#d4af37] transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-lg">{style.emoji}</span>
                    </motion.div>
                  ))}
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>+2 more</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Features Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Glowing border effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                
                <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
                  
                  {/* Icon Container */}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}
                    animate={hoveredFeature === index ? { 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-light text-white mb-4 group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                    {feature.description}
                  </p>

                  {/* Hover Effect Indicator */}
                  <motion.div
                    className={`absolute bottom-4 left-8 right-8 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredFeature === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                animate={{ 
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-[#d4af37] mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Demo Section */}
          <motion.div
            className="bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="space-y-8">
                <div>
                  <motion.div 
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 text-purple-400 font-medium text-sm mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Powered by Advanced ML
                  </motion.div>
                  
                  <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                    Experience the{' '}
                    <span className="bg-gradient-to-r from-[#d4af37] to-[#f0d666] bg-clip-text text-transparent font-normal">
                      Future
                    </span>
                    {' '}of Eyewear
                  </h2>
                  
                  <p className="text-xl text-gray-300 leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                    Our cutting-edge AR technology uses machine learning to track your face with incredible precision, 
                    ensuring every frame fits perfectly before you buy.
                  </p>
                </div>

                {/* Enhanced Feature List */}
                <div className="space-y-4">
                  {[
                    { icon: <Eye className="w-5 h-5" />, text: '468-point facial landmark tracking' },
                    { icon: <Zap className="w-5 h-5" />, text: 'Real-time Adam optimizer smoothing' },
                    { icon: <Camera className="w-5 h-5" />, text: 'HD photo capture & comparison' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Privacy-first, no data stored' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    >
                      <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center text-[#d4af37]">
                        {item.icon}
                      </div>
                      <span className="font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    onClick={openAR}
                    disabled={!isARSupported}
                    className={`group relative px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl ${
                      isARSupported
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#f0d666] hover:from-[#c9a030] hover:to-[#e6c14d] text-black'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } overflow-hidden`}
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                    whileHover={isARSupported ? { scale: 1.05 } : {}}
                    whileTap={isARSupported ? { scale: 0.95 } : {}}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Start Virtual Try-On
                    </span>
                    {isARSupported && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#b8962a] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => document.getElementById('bestsellers-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group border-2 border-gray-600 hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#d4af37]/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                  >
                    Browse Collection
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </motion.button>
                </div>
              </div>

              {/* Right Visual */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {/* Mock AR Interface */}
                <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50 shadow-2xl">
                  
                  {/* Mock Video Feed */}
                  <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl mb-6 relative overflow-hidden border border-blue-400/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                    
                    {/* Face Outline Animation */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-[#d4af37] rounded-full opacity-60"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Floating Glasses Preview */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      👓
                    </motion.div>

                    {/* Status Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs font-medium">Tracking Active</span>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">30 FPS</span>
                    </div>
                  </div>

                  {/* Mock Controls */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {glassesPreview.slice(0, 3).map((style, index) => (
                        <motion.div
                          key={style.id}
                          className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center border border-gray-600 hover:border-[#d4af37] transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          animate={{ 
                            y: [0, -2, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: index * 0.3,
                            repeat: Infinity
                          }}
                        >
                          <span className="text-lg">{style.emoji}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.button
                      className="px-4 py-2 bg-[#d4af37] text-black rounded-xl font-medium hover:bg-[#e6c14d] transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Capture
                    </motion.button>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Bottom CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl">
              <h3 className="text-3xl lg:text-4xl font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                Ready to See Yourself in{' '}
                <span className="text-[#d4af37]">Perfect Frames</span>?
              </h3>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                Join thousands of customers who found their perfect eyewear using our AR technology
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.button
                  onClick={openAR}
                  disabled={!isARSupported}
                  className={`group relative px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-2xl ${
                    isARSupported
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f0d666] to-[#d4af37] hover:from-[#c9a030] hover:via-[#e6c14d] hover:to-[#c9a030] text-black'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  } overflow-hidden`}
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                  whileHover={isARSupported ? { scale: 1.05, y: -3 } : {}}
                  whileTap={isARSupported ? { scale: 0.98 } : {}}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Play className="w-6 h-6" />
                    {isARSupported ? 'Try AR Now' : 'Update Browser for AR'}
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  {isARSupported && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#b8962a] via-[#d4af37] to-[#b8962a]"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  )}
                </motion.button>

                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-black shadow-lg" />
                    ))}
                  </div>
                  <span className="text-sm font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                    Join 50K+ satisfied customers
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AR Try-On Modal */}
      <ARTryOn isOpen={isAROpen} onClose={closeAR} />
    </section>
  );
}