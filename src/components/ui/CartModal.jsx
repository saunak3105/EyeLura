import React, { useState, useEffect } from 'react';

// Sample cart items for demonstration
const sampleCartItems = [
  {
    id: 1,
    name: 'Aviator Prestige',
    price: 1329,
    originalPrice: 1599,
    image: 'https://i.ibb.co/271DJ6YD/austin-p-x-ro8-SEHw-Gw-unsplash.jpg',
    quantity: 1,
    category: 'sunglasses',
    discount: 17
  },
  {
    id: 2,
    name: 'Metropolitan Frame',
    price: 1289,
    originalPrice: 1489,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    quantity: 1,
    category: 'frames',
    discount: 13
  }
];

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);

  // Toggle between empty and filled cart for demo
  const toggleCartState = () => {
    setShowEmptyState(!showEmptyState);
    setCartItems(showEmptyState ? [] : sampleCartItems);
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Set initial state - you can remove this and use real cart data
      setCartItems(showEmptyState ? [] : sampleCartItems);
    }
  }, [isOpen, showEmptyState]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        className={`bg-[#070808] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-[#070808]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
              <span className="text-[#070808] text-sm">🛒</span>
            </div>
            <h4 className="text-xl font-bold text-[#d4af37]">Your Collection</h4>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#333] transition-colors duration-200 text-[#d4af37]"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Demo Toggle Button */}
        <div className="px-6 py-2 bg-[#111] border-b border-[#333]">
          <button
            onClick={toggleCartState}
            className="text-sm text-[#d4af37] hover:text-[#f0d070] font-medium"
          >
            {showEmptyState ? 'Show Cart with Items' : 'Show Empty Cart'} (Demo)
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto border border-[#333]">
                <span className="text-3xl text-[#d4af37]">🛒</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#d4af37]">Your collection is empty</h3>
                <p className="text-gray-400">Discover amazing eyewear that matches your style</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-[#d4af37] hover:bg-[#f0d070] text-[#070808] px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Products
              </button>
            </div>
          ) : (
            /* Cart Items - Horizontal Layout */
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {cartItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex-none w-64 p-4 bg-[#111]/90 backdrop-blur-sm rounded-xl border border-[#333] hover:border-[#d4af37] transition-all duration-300 ${
                      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        {item.discount && (
                          <div className="absolute -top-1 -right-1 bg-[#d4af37] text-[#070808] text-xs px-1 py-0.5 rounded-full">
                            -{item.discount}%
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-white text-sm truncate">{item.name}</h5>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-[#d4af37] transition-colors duration-200 ml-2"
                          >
                            <span className="text-xs">🗑️</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm font-bold text-[#d4af37]">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-[#333] rounded-full text-xs text-gray-300 capitalize">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1 bg-[#333] rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#444] transition-colors duration-200 text-xs text-white"
                            >
                              -
                            </button>
                            <span className="font-medium text-xs px-1 text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#444] transition-colors duration-200 text-xs text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - only show when cart has items */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#333] bg-[#070808] px-6 py-4 space-y-4">
            {/* Savings Banner */}
            {savings > 0 && (
              <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-lg p-3 text-center">
                <p className="text-[#d4af37] font-semibold">
                  🎉 You're saving ₹{savings} on this order!
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Shipping</span>
                <span className="font-medium text-[#d4af37]">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Student Discount</span>
                <span className="font-medium text-[#d4af37]">Applied</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#d4af37] pt-2 border-t border-[#333]">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#d4af37] hover:bg-[#f0d070] text-[#070808] py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Proceed to Checkout
              </button>
              <button 
                onClick={onClose}
                className="w-full border-2 border-[#333] hover:border-[#d4af37] text-[#d4af37] hover:text-[#f0d070] py-3 rounded-full font-semibold transition-all duration-300 hover:bg-[#111]"
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 pt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <span>↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}