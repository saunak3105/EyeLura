import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function CartModal({ isOpen, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(cartId);
    } else {
      updateQuantity(cartId, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const savings = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);

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
            <h4 className="text-xl font-bold text-[#d4af37]" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>Your Collection</h4>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#333] transition-colors duration-200 text-[#d4af37]"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto border border-[#333]">
                <span className="text-3xl text-[#d4af37]">🛒</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#d4af37]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>Your collection is empty</h3>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Discover amazing eyewear that matches your style</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-[#d4af37] hover:bg-[#f0d070] text-[#070808] px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            /* Cart Items */
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.cartId}
                    className={`p-4 bg-[#111]/90 backdrop-blur-sm rounded-xl border border-[#333] hover:border-[#d4af37] transition-all duration-300 ${
                      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {item.discount && (
                          <div className="absolute -top-1 -right-1 bg-[#d4af37] text-[#070808] text-xs px-1 py-0.5 rounded-full">
                            -{item.discount}%
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-white text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>{item.name}</h5>
                          <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-gray-400 hover:text-[#d4af37] transition-colors duration-200 ml-2"
                          >
                            <span className="text-xs">🗑️</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-[#d4af37]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700' }}>₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className="px-2 py-1 bg-[#333] rounded-full text-gray-300">
                            {item.selectedColor}
                          </span>
                          <span className="px-2 py-1 bg-[#333] rounded-full text-gray-300">
                            {item.selectedSize}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-[#333] rounded-full text-xs text-gray-300 capitalize">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1 bg-[#333] rounded-full px-2 py-1">
                            <button 
                              onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#444] transition-colors duration-200 text-xs text-white"
                            >
                              -
                            </button>
                            <span className="font-medium text-xs px-2 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#444] transition-colors duration-200 text-xs text-white"
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
        {items.length > 0 && (
          <div className="border-t border-[#333] bg-[#070808] px-6 py-4 space-y-4">
            {/* Savings Banner */}
            {savings > 0 && (
              <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-lg p-3 text-center">
                <p className="text-[#d4af37] font-semibold" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                  🎉 You're saving ₹{savings} on this order!
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Shipping</span>
                <span className="font-medium text-[#d4af37]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Student Discount</span>
                <span className="font-medium text-[#d4af37]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>Applied</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#d4af37] pt-2 border-t border-[#333]">
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700' }}>Total</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700' }}>₹{subtotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#d4af37] hover:bg-[#f0d070] text-[#070808] py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                Proceed to Checkout
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={onClose}
                  className="flex-1 border-2 border-[#333] hover:border-[#d4af37] text-[#d4af37] hover:text-[#f0d070] py-3 rounded-full font-semibold transition-all duration-300 hover:bg-[#111]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={clearCart}
                  className="px-4 border-2 border-red-500 hover:border-red-400 text-red-500 hover:text-red-400 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-red-500/10"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 pt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚚</span>
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <span>↩️</span>
                <span style={{ fontFamily: "'Inter', sans-serif" }}>Easy Returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}