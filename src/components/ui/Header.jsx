import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Animation variants
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const authModalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <motion.header 
        className="fixed w-full bg-black backdrop-blur-lg border-b border-gray-800/50 z-50 font-sans"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="mx-auto flex h-20 justify-between items-center px-4 sm:px-6 md:px-8 max-w-7xl">
          <nav className="flex items-center gap-12">
            <motion.a 
              href="#" 
              className="text-3xl text-white hover:text-[#d4af37] transition-all duration-300 font-playfair"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              EyeLura
            </motion.a>
            <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {['Shop', 'Virtual Try-On', 'Products', 'Student Deals'].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-white hover:text-[#d4af37] transition-colors duration-300 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            {/* Cart Button */}
            <motion.button 
              onClick={onCartClick} 
              className="relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-gray-700 hover:border-[#d4af37] transition-all duration-300 hover:bg-gray-900">
                <span className="text-xl">🛒</span>
              </div>
              <motion.span 
                className="absolute -top-2 -right-2 text-xs bg-[#d4af37] text-black rounded-full px-2 py-0.5 font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                0
              </motion.span>
            </motion.button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={() => handleAuthClick('login')}
                className="text-white hover:text-[#d4af37] transition-colors duration-300 font-medium px-3 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => handleAuthClick('signup')}
                className="bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>

            <motion.a 
              href="#try-on" 
              className="hidden md:inline-block bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Try Now
            </motion.a>

            {/* Mobile menu button */}
            <motion.button 
              className="lg:hidden w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-gray-700 hover:border-[#d4af37] transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <motion.span 
                  className="w-full h-0.5 bg-white"
                  animate={isMenuOpen ? 
                    { rotate: 45, y: 1.5 } : 
                    { rotate: 0, y: 0 }
                  }
                ></motion.span>
                <motion.span 
                  className="w-full h-0.5 bg-white"
                  animate={isMenuOpen ? 
                    { opacity: 0 } : 
                    { opacity: 1 }
                  }
                ></motion.span>
                <motion.span 
                  className="w-full h-0.5 bg-white"
                  animate={isMenuOpen ? 
                    { rotate: -45, y: -1.5 } : 
                    { rotate: 0, y: 0 }
                  }
                ></motion.span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu with AnimatePresence for smooth exit animations */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="lg:hidden bg-black border-t border-gray-700 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              <nav className="px-4 py-6 space-y-4">
                {['Collections', 'Virtual Try-On', 'Products', 'Student Deals'].map((item, index) => (
                  <motion.a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="block text-white hover:text-[#d4af37] transition-colors duration-300 font-medium"
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="flex gap-4 mt-4">
                  <motion.button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleAuthClick('login');
                    }}
                    className="flex-1 text-white hover:text-[#d4af37] border border-[#d4af37] px-4 py-2 rounded-full font-medium transition-colors duration-300"
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleAuthClick('signup');
                    }}
                    className="flex-1 bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-300"
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.35 }}
                  >
                    Sign Up
                  </motion.button>
                </div>
                <motion.a 
                  href="#try-on" 
                  className="block bg-[#d4af37] hover:bg-[#d4af37]/90 text-black px-6 py-3 rounded-full font-semibold text-center mt-6"
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Now
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-[#070808] border border-[#0a0a0a] rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={authModalVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {authMode === 'login' ? 'Login to Your Account' : 'Create an Account'}
                </h3>
                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-6">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0a0a0a] border border-[#0a0a0a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#0a0a0a] border border-[#0a0a0a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#0a0a0a] border border-[#0a0a0a] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
                {authMode === 'login' && (
                  <div className="flex justify-between items-center">
                    <label className="flex items-center space-x-2 text-gray-300">
                      <input type="checkbox" className="rounded bg-[#0a0a0a] border-[#0a0a0a] text-[#d4af37] focus:ring-[#d4af37]" />
                      <span>Remember me</span>
                    </label>
                    <a href="#forgot-password" className="text-[#d4af37] hover:underline">Forgot password?</a>
                  </div>
                )}
                <button 
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#d4af37]/90 text-black py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                >
                  {authMode === 'login' ? 'Login' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center text-gray-400">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setAuthMode('signup')}
                      className="text-[#d4af37] hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setAuthMode('login')}
                      className="text-[#d4af37] hover:underline font-medium"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>

              {authMode === 'login' && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#070808] px-4 text-gray-400">or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#0a0a0a]/80 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                      <span>G</span> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#0a0a0a]/80 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                      <span>F</span> Facebook
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}