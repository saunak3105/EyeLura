import React, { useState, useEffect } from 'react';
import { products } from '../../data/products';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let filtered = [...products];

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
        // Featured sorting (by badge priority)
        const badgePriority = { 'Bestseller': 3, 'New': 2, 'Student Fav': 1 };
        filtered.sort((a, b) => (badgePriority[b.badge] || 0) - (badgePriority[a.badge] || 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, priceRange]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      {/* Header */}
      <div className={`py-16 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-[#d4af37] font-medium shadow-sm mb-6">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-2 animate-pulse"></span>
            Premium Collection
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop <span className="text-[#d4af37]">Eyewear</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover our complete collection of premium eyewear designed for the modern generation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 space-y-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Filters
              </h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Category</h4>
                <div className="space-y-2">
                  {['all', 'sunglasses', 'frames'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-[#d4af37] focus:ring-[#d4af37]"
                      />
                      <span className="ml-2 text-gray-600 capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {category === 'all' ? 'All Products' : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#d4af37]"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  style={{ fontFamily: "'Playfair Display', serif" }}
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

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className={`mb-6 flex justify-between items-center transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <p className="text-gray-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                Showing {filteredProducts.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group relative bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
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
                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">₹{product.originalPrice}</div>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex text-[#d4af37]">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span>({product.reviews} reviews)</span>
                    </div>

                    {/* Category tag */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 capitalize">
                        {product.category}
                      </span>
                      {product.category === 'frames' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          Prescription Ready
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-[#d4af37] hover:bg-[#d4af37]/90 text-black py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  No products found
                </h3>
                <p className="text-gray-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}