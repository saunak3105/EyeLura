
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Header from '../ui/Header';
import CartModal from '../ui/CartModal';
import AuthModal from '../ui/AuthModal';
import { Heart, ShoppingCart, Star, Sparkles, Rainbow, Sun, Cloud, Zap, Gift } from 'lucide-react';

const kidsProducts = [
  {
    id: 101,
    name: 'Rainbow Explorer',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    reviews: 156,
    rating: 4.9,
    category: 'kids-sunglasses',
    badge: 'Super Cool!',
    discount: 18,
    description: 'Colorful sunglasses that make every adventure more fun!',
    features: ['UV Protection', 'Flexible Frame', 'Fun Colors', 'Comfortable Fit'],
    specifications: {
      frameWidth: '120mm',
      lensWidth: '45mm',
      bridgeWidth: '16mm',
      templeLength: '125mm',
      weight: '15g',
      material: 'Flexible TR90'
    },
    colors: ['Rainbow', 'Pink', 'Blue'],
    sizes: ['XS', 'S'],
    ageRange: '3-8 years',
    inStock: true,
    stockCount: 25
  },
  {
    id: 102,
    name: 'Super Hero Specs',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    reviews: 203,
    rating: 4.8,
    category: 'kids-frames',
    badge: 'Hero Power!',
    discount: 20,
    description: 'Transform into your favorite superhero with these awesome frames!',
    features: ['Blue Light Filter', 'Durable Design', 'Hero Colors', 'Easy Clean'],
    specifications: {
      frameWidth: '125mm',
      lensWidth: '48mm',
      bridgeWidth: '18mm',
      templeLength: '130mm',
      weight: '18g',
      material: 'Impact Resistant Acetate'
    },
    colors: ['Red', 'Blue', 'Green'],
    sizes: ['XS', 'S', 'M'],
    ageRange: '5-12 years',
    inStock: true,
    stockCount: 18
  },
  {
    id: 103,
    name: 'Princess Sparkle',
    price: 849,
    originalPrice: 1049,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    reviews: 89,
    rating: 4.7,
    category: 'kids-sunglasses',
    badge: 'Magical!',
    discount: 19,
    description: 'Sparkly frames fit for a princess or prince!',
    features: ['Glitter Design', 'UV Protection', 'Comfortable', 'Magical Look'],
    specifications: {
      frameWidth: '118mm',
      lensWidth: '44mm',
      bridgeWidth: '15mm',
      templeLength: '120mm',
      weight: '14g',
      material: 'Sparkle Acetate'
    },
    colors: ['Pink', 'Purple', 'Gold'],
    sizes: ['XS', 'S'],
    ageRange: '4-10 years',
    inStock: true,
    stockCount: 32
  },
  {
    id: 104,
    name: 'Space Adventure',
    price: 929,
    originalPrice: 1129,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    reviews: 124,
    rating: 4.8,
    category: 'kids-frames',
    badge: 'Cosmic!',
    discount: 18,
    description: 'Blast off to space with these out-of-this-world frames!',
    features: ['Space Design', 'Blue Light Filter', 'Glow Effects', 'Adventure Ready'],
    specifications: {
      frameWidth: '130mm',
      lensWidth: '50mm',
      bridgeWidth: '17mm',
      templeLength: '135mm',
      weight: '20g',
      material: 'Cosmic Polymer'
    },
    colors: ['Galaxy', 'Silver', 'Black'],
    sizes: ['S', 'M'],
    ageRange: '6-12 years',
    inStock: true,
    stockCount: 21
  }
];

const FloatingBubble = ({ size, color, delay, position }) => (
  <motion.div
    className={`absolute ${position} w-${size} h-${size} ${color} rounded-full opacity-20`}
    animate={{
      y: [0, -30, 0],
      x: [0, 10, -10, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

const MagicalIcon = ({ icon, delay = 0, className = "" }) => (
  <motion.div
    className={`text-4xl ${className}`}
    animate={{
      rotate: [0, 10, -10, 0],
      scale: [1, 1.2, 1],
      y: [0, -5, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {icon}
  </motion.div>
);

export default function Kids() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, product.colors[0], product.sizes[0], 1);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingBubble size="32" color="bg-yellow-300" delay={0} position="top-20 left-10" />
        <FloatingBubble size="24" color="bg-pink-300" delay={1} position="top-40 right-20" />
        <FloatingBubble size="28" color="bg-blue-300" delay={2} position="bottom-40 left-20" />
        <FloatingBubble size="20" color="bg-green-300" delay={0.5} position="top-60 right-10" />
        <FloatingBubble size="36" color="bg-purple-300" delay={1.5} position="bottom-20 right-1/4" />
        
        {/* Floating Icons */}
        <div className="absolute top-24 left-16">
          <MagicalIcon icon="🌟" delay={0} />
        </div>
        <div className="absolute top-36 right-24">
          <MagicalIcon icon="🎨" delay={0.5} />
        </div>
        <div className="absolute bottom-32 left-24">
          <MagicalIcon icon="🚀" delay={1} />
        </div>
        <div className="absolute bottom-48 right-16">
          <MagicalIcon icon="🦄" delay={1.5} />
        </div>
        <div className="absolute top-1/2 left-1/3">
          <MagicalIcon icon="⚡" delay={2} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Magical Badge */}
          <motion.div 
            className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold text-lg shadow-2xl mb-8 border border-white/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Sparkles className="w-6 h-6 mr-3 text-yellow-300" />
            Welcome to Kids Wonderland! 
            <Star className="w-6 h-6 ml-3 text-yellow-300" />
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-none"
            style={{ 
              fontFamily: "'Fredoka One', cursive",
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Super Cool
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Kids Glasses!
            </span>
            <motion.span
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="inline-block ml-4"
            >
              😎
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-2xl md:text-3xl text-white/90 font-bold mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ 
              fontFamily: "'Baloo 2', cursive",
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            🌈 Where Every Kid Becomes a Superhero! 🌈
            <br />
            <span className="text-xl text-white/80">
              Discover magical eyewear that makes learning and playing super fun!
            </span>
          </motion.p>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              { number: "5000+", label: "Happy Kids", icon: "😊", color: "from-pink-400 to-red-400" },
              { number: "100%", label: "Safe & Fun", icon: "🛡️", color: "from-blue-400 to-indigo-400" },
              { number: "★★★★★", label: "Parent Approved", icon: "👨‍👩‍👧‍👦", color: "from-green-400 to-teal-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 shadow-2xl border border-white/20`}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-white/90 font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              onClick={() => navigate('/shop/kids')}
              className="group bg-white hover:bg-yellow-100 text-purple-600 px-12 py-5 rounded-full text-2xl font-bold shadow-2xl transition-all duration-300"
              style={{ fontFamily: "'Baloo 2', cursive" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              🛍️ Start Shopping Adventure!
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="group border-4 border-white hover:border-yellow-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl transition-all duration-300"
              style={{ fontFamily: "'Baloo 2', cursive" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ Learn More Magic!
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Our Magical Collection! ✨
            </h2>
            <p className="text-xl text-white/90 font-bold max-w-2xl mx-auto" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Each pair is specially designed to make kids feel amazing and confident!
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {kidsProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.id)}
              >
                {/* Badge */}
                <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl ${
                  product.badge === 'Super Cool!' ? 'bg-gradient-to-r from-pink-500 to-red-500' :
                  product.badge === 'Hero Power!' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                  product.badge === 'Magical!' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  'bg-gradient-to-r from-green-500 to-blue-500'
                }`}>
                  {product.badge}
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <motion.div 
                    className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    -{product.discount}% OFF!
                  </motion.div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={hoveredProduct === product.id && product.images[1] ? product.images[1] : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Action Buttons */}
                  <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <motion.button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className={`w-14 h-14 rounded-full backdrop-blur-sm border-2 border-white/50 flex items-center justify-center transition-all duration-300 shadow-lg ${
                        isInWishlist(product.id) 
                          ? 'bg-red-500 text-white border-red-400' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300" style={{ fontFamily: "'Baloo 2', cursive" }}>
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">₹{product.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  {/* Age Range */}
                  <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full px-4 py-2 text-center">
                    <span className="text-sm font-bold text-orange-800">
                      Perfect for {product.ageRange} 👶
                    </span>
                  </div>

                  {/* Reviews */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex text-yellow-500">
                      {'★'.repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-gray-600 font-bold">({product.reviews} happy kids!)</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-center font-medium leading-relaxed" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    {product.description}
                  </p>

                  {/* CTA Button */}
                  <motion.button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-full font-bold transition-all duration-300 shadow-lg text-lg"
                    style={{ fontFamily: "'Baloo 2', cursive" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    👀 See All Details!
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-5xl lg:text-6xl font-black text-white mb-16"
            style={{ fontFamily: "'Fredoka One', cursive" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Why Kids & Parents Love Us! 💝
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: 'Super Safe!', desc: 'UV protection & unbreakable materials for active kids' },
              { icon: '🎨', title: 'Amazing Colors!', desc: 'Endless rainbow of fun colors and magical designs' },
              { icon: '😊', title: 'Comfy All Day!', desc: 'Lightweight & comfortable for school and play time' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className="text-7xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  {feature.title}
                </h3>
                <p className="text-white/90 font-medium text-lg leading-relaxed" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Ready for the Adventure? 🚀
          </h2>
          <p className="text-2xl text-white/90 font-bold mb-12 leading-relaxed" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Join thousands of happy kids who found their perfect magical glasses!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => navigate('/shop/kids')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl"
              style={{ fontFamily: "'Baloo 2', cursive" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              🌟 Start Shopping Magic!
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/contact')}
              className="border-4 border-white hover:border-yellow-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl"
              style={{ fontFamily: "'Baloo 2', cursive" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              📞 Ask Parents First!
            </motion.button>
          </div>
        </motion.div>
      </section>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
      
      <AuthModal />
    </div>
  );
}