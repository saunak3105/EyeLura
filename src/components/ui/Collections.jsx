
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles, Star, Sun, Glasses, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const collections = [
  {
    id: 'sunglasses',
    title: 'Premium Sunglasses',
    subtitle: 'UV Protection & Style',
    description: 'Discover our curated collection of premium sunglasses featuring cutting-edge UV protection technology and timeless designs that complement every lifestyle.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    category: 'sunglasses',
    badge: '100% UV Protection',
    price: 'From ₹2,299',
    gradient: 'from-orange-400 to-red-500',
    icon: Sun,
    features: [
      'Polarized Lenses Available',
      'Premium Materials',
      'Lightweight Design',
      'UV400 Protection'
    ],
    highlights: [
      { icon: Shield, text: '100% UV Protection' },
      { icon: Sparkles, text: 'Premium Quality' },
      { icon: Eye, text: 'Enhanced Clarity' }
    ]
  },
  {
    id: 'frames',
    title: 'Optical Frames',
    subtitle: 'Prescription Ready',
    description: 'Contemporary frames that blend cutting-edge materials with minimalist design philosophy. Perfect for everyday wear with blue light protection for digital screens.',
    image: 'https://i.ibb.co/XkXbMGrZ/lensabl-0-Gf-Plommtx-M-unsplash.jpg',
    category: 'frames',
    badge: 'Blue Light Filter',
    price: 'From ₹2,289',
    gradient: 'from-blue-400 to-indigo-500',
    icon: Glasses,
    features: [
      'Blue Light Protection',
      'Student Discounts Available',
      'AR Try-On Ready',
      'Prescription Compatible'
    ],
    highlights: [
      { icon: Zap, text: 'Blue Light Filter' },
      { icon: Sparkles, text: 'Student Discounts' },
      { icon: Eye, text: 'Prescription Ready' }
    ]
  }
];

export default function Collections() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleExploreCollection = (category) => {
    navigate(`/shop?category=${category}`);
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="border border-gray-700"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, delay: i * 0.05, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <motion.div 
            className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Badge */}
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-[#d4af37] font-semibold shadow-xl mb-8"
              animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Signature Collection</span>
              <Star className="w-5 h-5 ml-2" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
              Premium{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#d4af37] to-[#f0d666] bg-clip-text text-transparent font-normal">
                  Eyewear
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#f0d666] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
              {' '}Collections
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
              Meticulously curated eyewear that defines contemporary luxury. 
              <br />
              <span className="text-[#d4af37] font-medium">Student discounts available</span> on all frames!!
            </p>
          </motion.div>

          {/* Enhanced Collections Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {collections.map((collection, index) => {
              const IconComponent = collection.icon;
              return (
                <motion.div
                  key={collection.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Glowing border effect */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${collection.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                  
                  {/* Card Container */}
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:border-gray-600 transform hover:-translate-y-4">
                    
                    {/* Image Container with Overlay */}
                    <div className="relative h-80 md:h-96 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Floating Elements */}
                      <div className="absolute top-6 left-6">
                        <div className={`flex items-center gap-2 bg-gradient-to-r ${collection.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                          <IconComponent className="w-4 h-4" />
                          {collection.badge}
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                        {collection.price}
                      </div>

                      {/* Hover Overlay with Quick Actions */}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <motion.button
                          onClick={() => handleExploreCollection(collection.category)}
                          className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-8 space-y-6">
                      {/* Title and Subtitle */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className={`w-6 h-6 bg-gradient-to-r ${collection.gradient} bg-clip-text text-transparent`} />
                          <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">{collection.subtitle}</span>
                        </div>
                        <h3 className="text-3xl font-light text-white group-hover:text-[#d4af37] transition-colors duration-300 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                          {collection.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                          {collection.description}
                        </p>
                      </div>

                      {/* Highlights */}
                      <div className="grid grid-cols-3 gap-4">
                        {collection.highlights.map((highlight, idx) => {
                          const HighlightIcon = highlight.icon;
                          return (
                            <div key={idx} className="flex flex-col items-center text-center">
                              <div className={`w-12 h-12 bg-gradient-to-r ${collection.gradient} rounded-full flex items-center justify-center mb-2 shadow-lg`}>
                                <HighlightIcon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-xs text-gray-400 font-medium">{highlight.text}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Features List */}
                      <div className="space-y-2">
                        {collection.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-300">
                            <div className={`w-5 h-5 bg-gradient-to-r ${collection.gradient} rounded-full flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-sm font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Enhanced CTA Button */}
                      <motion.button
                        onClick={() => handleExploreCollection(collection.category)}
                        className={`group/btn relative w-full bg-gradient-to-r ${collection.gradient} hover:shadow-2xl text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          Explore {collection.title}
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Social Proof Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-8 text-gray-400 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-black shadow-lg`} />
                  ))}
                </div>
                <span className="text-sm font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>10K+ happy customers</span>
              </div>
              <div className="text-sm font-light" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '300' }}>
                <span className="text-[#d4af37] font-semibold">4.2/5</span> average rating
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/shop')}
                className="group relative bg-gradient-to-r from-[#d4af37] to-[#f0d666] hover:from-[#c9a030] hover:to-[#e6c14d] text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
              >
                <span className="relative z-10">Shop All Collections</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#b8962a] to-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              
              <motion.button
                className="group border-2 border-gray-600 hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-[#d4af37]/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
              >
                AR Try-On Experience
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
