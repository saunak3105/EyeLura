import React, { useState, useEffect } from 'react';
import { products } from '../../data/products';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Header from '../ui/Header';
import CartModal from '../ui/CartModal';
import AuthModal from '../ui/AuthModal';
import { Heart, ShoppingCart, Eye, Filter, Grid, List, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Shop() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
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
        const badgePriority = { 'Bestseller': 3, 'New': 2, 'Student Fav': 1 };
        filtered.sort((a, b) => (badgePriority[b.badge] || 0) - (badgePriority[a.badge] || 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, priceRange, searchQuery]);

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

  return (
    <div className="min-h-screen bg-black">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      {/* Hero Section */}
      <div className={`pt-32 pb-16 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
            Premium <span className="text-[#d4af37]">Collection</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
            Discover exceptional eyewear crafted for discerning taste
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 space-y-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-light text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                  Filters
                </h3>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <h4 className="font-light text-gray-300 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-light text-gray-300 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>Category</h4>
                <div className="space-y-2">
                  {['all', 'sunglasses', 'frames'].map((category) => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-[#d4af37] focus:ring-[#d4af37] bg-transparent border-gray-600"
                      />
                      <span className="ml-3 text-gray-300 capitalize font-light group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                        {category === 'all' ? 'All Products' : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-light text-gray-300 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#d4af37] bg-gray-700 rounded-lg appearance-none h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-400 font-light">
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>₹{priceRange[0]}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-light text-gray-300 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent font-light transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className={`mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <p className="text-gray-400 font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                Showing {filteredProducts.length} products
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors duration-300 ${
                      viewMode === 'grid' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors duration-300 ${
                      viewMode === 'list' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#d4af37]/50 hover:shadow-2xl hover:shadow-[#d4af37]/10 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Limited' ? 'bg-red-500 text-white' :
                      product.badge === 'Student Fav' ? 'bg-blue-500 text-white' :
                      product.badge === 'Sport' ? 'bg-purple-500 text-white' :
                      product.badge === 'Classic' ? 'bg-gray-500 text-white' :
                      'bg-[#d4af37] text-black'
                    }`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={hoveredProduct === product.id && product.images && product.images[1] ? product.images[1] : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Actions */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`w-12 h-12 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          isInWishlist(product.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                        className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center text-black hover:bg-[#e6c14d] transition-all duration-300 hover:scale-110"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-light text-white group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-medium text-[#d4af37]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}>₹{product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through" style={{ fontFamily: "'Inter', sans-serif" }}>₹{product.originalPrice}</div>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex text-[#d4af37]">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>({product.reviews} reviews)</span>
                    </div>

                    {/* Category tag */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-xs capitalize font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                        {product.category}
                      </span>
                      {product.category === 'frames' && (
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                          Prescription Ready
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
                  No products found
                </h3>
                <p className="text-gray-400 font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
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