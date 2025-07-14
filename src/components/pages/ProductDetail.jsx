import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Check, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const productData = getProductById(id);
    if (productData) {
      setProduct(productData);
      setSelectedColor(productData.colors[0]);
      setSelectedSize(productData.sizes[0]);
      setIsVisible(true);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedColor, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
            Product Not Found
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-6 py-3 rounded-full font-semibold transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      {/* Back Button and Logo */}
      <div className={`px-4 sm:px-6 lg:px-8 py-6 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#d4af37] transition-colors duration-300"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>
          
          {/* Clickable Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-2xl text-gray-900 hover:text-[#d4af37] transition-all duration-300 font-bold"
            style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}
          >
            EyeLura
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className={`space-y-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
            {/* Main Image */}
            <div className="relative bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {product.badge && (
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
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
              {product.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index ? 'border-[#d4af37]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 capitalize" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Check className="w-3 h-3" />
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-[#d4af37] fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700' }}>₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through" style={{ fontFamily: "'Inter', sans-serif" }}>₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                    Save {product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {product.description}
            </p>

            {/* Options */}
            <div className="space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  Color: {selectedColor}
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-[#d4af37] bg-[#d4af37] text-black'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  Size: {selectedSize}
                </h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-[#d4af37] bg-[#d4af37] text-black'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {product.stockCount} available
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    addedToCart 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#d4af37] hover:bg-[#d4af37]/90 text-black'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="p-4 border-2 border-gray-300 hover:border-[#d4af37] rounded-full transition-all duration-300 hover:bg-[#d4af37]/10">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-[#d4af37]" />
                </button>
                <button className="p-4 border-2 border-gray-300 hover:border-[#d4af37] rounded-full transition-all duration-300 hover:bg-[#d4af37]/10">
                  <Share2 className="w-5 h-5 text-gray-600 hover:text-[#d4af37]" />
                </button>
              </div>

              <button
                className="w-full border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black py-4 px-6 rounded-full font-semibold transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
              >
                Try Virtual Fitting
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className={`mt-20 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-white/80'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
                    Product Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
                    Technical Specifications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700 capitalize" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '500' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#d4af37]">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">💬</div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }}>Reviews feature coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}