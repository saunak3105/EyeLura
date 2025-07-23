
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { kidsProducts } from '../../data/products';
import Header from '../ui/Header';
import CartModal from '../ui/CartModal';
import AuthModal from '../ui/AuthModal';
import { Heart, ShoppingCart, Eye, Filter, Search, Sparkles, Star, Rainbow, SlidersHorizontal, Grid, List } from 'lucide-react';

// Floating Animation Components
const FloatingElement = ({ children, delay = 0, duration = 3 }) => (
  <motion.div
    animate={{
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const BouncingIcon = ({ icon, color, size = "text-4xl", delay = 0, position }) => (
  <motion.div
    className={`${color} ${size} absolute ${position} opacity-60`}
    animate={{
      y: [0, -20, 0],
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0]
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

export default function KidsShop() {
  const [filteredProducts, setFilteredProducts] = useState(kidsProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [ageRange, setAgeRange] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let filtered = [...kidsProducts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by age range
    if (ageRange !== 'all') {
      filtered = filtered.filter(product => {
        if (ageRange === '2-5') return product.ageRange.includes('2-4') || product.ageRange.includes('4-6');
        if (ageRange === '6-8') return product.ageRange.includes('6-8');
        if (ageRange === '9-12') return product.ageRange.includes('8-12') || product.ageRange.includes('6-12');
        return true;
      });
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        const badgePriority = { 'Super Cool!': 3, 'Hero Power!': 2, 'Magical!': 1 };
        filtered.sort((a, b) => (badgePriority[b.badge] || 0) - (badgePriority[a.badge] || 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, priceRange, ageRange, searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, product.colors[0], product.sizes[0], 1);
  };

  const categories = [
    { id: 'all', name: 'All Magic Glasses' },
    { id: 'kids-sunglasses', name: 'Cool Sunglasses' },
    { id: 'kids-frames', name: 'Smart Frames'}
  ];

  const ageRanges = [
    { id: 'all', name: 'All Ages'},
    { id: '2-5', name: '2-5 Years'},
    { id: '6-8', name: '6-8 Years'},
    { id: '9-12', name: '9-12 Years'}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
      <Header onCartClick={() => setIsCartOpen(true)} />
      


      {/* Hero Section */}
      <div className={`pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Fun Badge */}
          <motion.div 
            className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-lg rounded-full text-white font-bold text-lg shadow-2xl mb-8 border border-white/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Kids' Ultimate Eyewear Shop! 
            <Star className="w-6 h-6 ml-3" />
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Fredoka One', cursive",
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Magical Kids
            <br />
            <span className="text-cyan-300">
              Glasses Adventure! 
            </span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
              className="inline-block ml-4"
            >
              
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-xl lg:text-2xl text-white/90 font-bold mb-8 max-w-3xl mx-auto"
            style={{ 
              fontFamily: "'Baloo 2', cursive",
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover Your Perfect Superhero Look! 
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <span className="text-2xl font-bold text-white">{kidsProducts.length}</span>
              <span className="text-white/90 ml-2 font-medium">Amazing Styles</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <span className="text-2xl font-bold text-white">100%</span>
              <span className="text-white/90 ml-2 font-medium">Safe & Fun</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <span className="text-2xl font-bold text-white">FREE</span>
              <span className="text-white/90 ml-2 font-medium">Home Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Search and View Controls */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search for magical glasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-full text-white placeholder-white/60 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 font-bold"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filters Toggle */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </motion.button>

              {/* View Mode Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1 border border-white/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Categories */}
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    <Rainbow className="w-5 h-5 mr-2" />
                    Choose Style
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-white text-purple-600 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                      >
                        <span className="text-xl">{category.icon}</span>
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    <span className="text-xl mr-2"></span>
                    Age Group
                  </h3>
                  <div className="space-y-3">
                    {ageRanges.map((age) => (
                      <motion.button
                        key={age.id}
                        onClick={() => setAgeRange(age.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                          ageRange === age.id
                            ? 'bg-white text-purple-600 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                      >
                        <span className="text-xl">{age.icon}</span>
                        {age.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    <span className="text-xl mr-2"></span>
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-white font-bold">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-yellow-400"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center" style={{ fontFamily: "'Baloo 2', cursive" }}>
                    <span className="text-xl mr-2"></span>
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all duration-300"
                    style={{ fontFamily: "'Baloo 2', cursive" }}
                  >
                    <option value="featured" className="text-gray-800">Most Popular</option>
                    <option value="price-low" className="text-gray-800">Cheapest First</option>
                    <option value="price-high" className="text-gray-800">Most Expensive</option>
                    <option value="rating" className="text-gray-800">Best Rated</option>
                    <option value="newest" className="text-gray-800">Newest</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className={`mb-8 text-center transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <p className="text-2xl text-white font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Found <span className="text-yellow-300 text-3xl">{filteredProducts.length}</span> magical glasses! 
          </p>
        </div>

        {/* Products Display */}
        <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-8xl mb-6"></div>
              <h3 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Oops! No magical glasses found
              </h3>
              <p className="text-white/80 font-bold mb-8 text-xl" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Try changing your search or magical filters!
              </p>
              <motion.button
                onClick={() => {
                  setSelectedCategory('all');
                  setAgeRange('all');
                  setSearchQuery('');
                  setPriceRange([0, 1500]);
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 text-xl shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                Show All Magic Glasses
              </motion.button>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
              : "space-y-6"
            }>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer ${
                    viewMode === 'list' ? 'flex gap-6 p-6' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: viewMode === 'grid' ? 1.03 : 1.01, y: -5 }}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Badge */}
                  <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
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
                      className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      -{product.discount}% OFF!
                    </motion.div>
                  )}

                  {/* Product Image */}
                  <div className={`relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 ${
                    viewMode === 'list' ? 'w-48 h-48 flex-shrink-0 rounded-2xl' : 'aspect-square'
                  }`}>
                    <img
                      src={hoveredProduct === product.id && product.images[1] ? product.images[1] : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Floating Action Buttons */}
                    <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <motion.button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`w-12 h-12 rounded-full backdrop-blur-sm border-2 border-white/50 flex items-center justify-center transition-all duration-300 shadow-lg ${
                          isInWishlist(product.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
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
                        Perfect for {product.ageRange} 
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
                    <p className="text-gray-600 text-center font-bold leading-relaxed" style={{ fontFamily: "'Baloo 2', cursive" }}>
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
                      See Magic Details!
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
      
      <AuthModal />
    </div>
  );
}
