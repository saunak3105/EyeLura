import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, Download, Sparkles, Eye, Zap, Play, Pause, Settings } from 'lucide-react';
import ARTryOn from './ARTryOn';
import { useARTryOn } from '../../hooks/useARTryOn';

export default function TryOn() {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { isAROpen, openAR, closeAR } = useARTryOn();

  // Demo frames for showcase
  const demoFrames = [
    {
      id: 1,
      name: 'Classic Aviator',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Timeless aviator design with premium materials',
      price: '₹1,329'
    },
    {
      id: 2,
      name: 'Modern Square',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Contemporary square frames for professionals',
      price: '₹1,289'
    },
    {
      id: 3,
      name: 'Vintage Round',
      image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Retro-inspired round glasses with character',
      price: '₹1,459'
    },
    {
      id: 4,
      name: 'Cat Eye Chic',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Elegant cat-eye frames for sophisticated style',
      price: '₹1,599'
    }
  ];

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Real-Time Tracking',
      description: 'Advanced face detection with 30+ FPS performance'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Fitting',
      description: 'See how frames look on you immediately'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'HD Quality',
      description: 'High-definition camera feed for accurate preview'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Smart Adjustment',
      description: 'Automatic scaling and positioning for perfect fit'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('try-on-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Auto-rotate demo frames
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoFrames.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [demoFrames.length]);

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      let errorMessage = 'Unable to access webcam. ';

      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please check your camera permissions and try again.';
      }

      setWebcamError(errorMessage);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
    }
    setWebcamError(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        stopWebcam();
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip for selfie camera
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/png');
      setUploadedImage(imageData);
      stopWebcam();
    }
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `eyelura-tryout-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const resetTryOn = () => {
    setSelectedFrame(null);
    setUploadedImage(null);
    setWebcamError(null);
    stopWebcam();
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <section id="try-on-section" className="py-20 bg-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated Badge */}
          <motion.div 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-400/30 mb-8 backdrop-blur-sm"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(212, 175, 55, 0.3)',
                '0 0 30px rgba(212, 175, 55, 0.5)',
                '0 0 20px rgba(212, 175, 55, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400 mr-3" />
            <span className="text-yellow-400 font-bold text-lg">Next-Gen AR Technology</span>
            <Eye className="w-6 h-6 text-yellow-400 ml-3" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
            <span className="font-playfair">Try Before You</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-normal">
              Buy
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            Experience our revolutionary AR technology powered by advanced face tracking. 
            See how you look in any frame instantly, right from your device.
          </p>

          {/* Main CTA Button */}
          <motion.button
            onClick={openAR}
            className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Launch AR Try-On
              <Eye className="w-6 h-6" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:shadow-xl hover:border-[#d4af37]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Demo Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Demo Interface */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-white flex items-center">
                  <Camera className="w-6 h-6 text-yellow-400 mr-3" />
                  Quick Start Options
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Ready to use
                </div>
              </div>

              {/* Enhanced Error Display */}
              <AnimatePresence>
                {webcamError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-start gap-3">
                      <Camera className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-400 font-semibold text-sm mb-1">Camera Access Required</h4>
                        <p className="text-red-300 text-sm leading-relaxed">{webcamError}</p>
                        <motion.button
                          onClick={startWebcam}
                          className="mt-3 text-red-400 hover:text-red-300 text-sm font-semibold underline"
                          whileHover={{ scale: 1.02 }}
                        >
                          Try Again
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!uploadedImage && !isWebcamActive && (
                <div className="space-y-4">
                  {/* Primary AR Button */}
                  <motion.button
                    onClick={openAR}
                    className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-6 h-6" />
                    Start AR Experience
                    <Eye className="w-6 h-6" />
                  </motion.button>

                  {/* Alternative Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={startWebcam}
                      className="flex flex-col items-center justify-center p-4 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Camera className="w-6 h-6 mb-2 text-blue-400" />
                      <span className="text-sm">Basic Webcam</span>
                    </motion.button>

                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="w-6 h-6 mb-2 text-purple-400" />
                      <span className="text-sm">Upload Photo</span>
                    </motion.button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Enhanced Camera Feed */}
              <AnimatePresence>
                {isWebcamActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-2xl"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <motion.button
                        onClick={capturePhoto}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Camera className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={stopWebcam}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Pause className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Recording indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Live</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Image Preview */}
              <AnimatePresence>
                {uploadedImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-full rounded-2xl"
                    />
                    
                    {/* Virtual frame overlay simulation */}
                    {selectedFrame && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="w-64 h-20 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-lg border-2 border-yellow-400/50 flex items-center justify-center backdrop-blur-sm"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-yellow-400 font-semibold">Virtual Frame Preview</span>
                        </motion.div>
                      </div>
                    )}

                    {/* Image Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <motion.button
                        onClick={downloadImage}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        onClick={resetTryOn}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>

          {/* Enhanced Frame Showcase */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-white flex items-center">
                  <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                  Featured Frames
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Auto-rotating</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Animated Frame Carousel */}
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={demoFrames[currentDemo].image}
                      alt={demoFrames[currentDemo].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Frame Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {demoFrames[currentDemo].name}
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                          {demoFrames[currentDemo].description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-bold text-lg">
                            {demoFrames[currentDemo].price}
                          </span>
                          <button
                            onClick={() => setSelectedFrame(demoFrames[currentDemo])}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                          >
                            Try This Frame
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {demoFrames.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDemo(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentDemo === index ? 'bg-yellow-400 w-6' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Frame Selection Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {demoFrames.slice(0, 4).map((frame, index) => (
                  <motion.button
                    key={frame.id}
                    onClick={() => {
                      setSelectedFrame(frame);
                      setCurrentDemo(index);
                    }}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedFrame?.id === frame.id
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/25'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white font-medium text-xs truncate">{frame.name}</h4>
                    </div>
                    {selectedFrame?.id === frame.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Instructions */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* How It Works */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-400/20 backdrop-blur-sm">
              <h4 className="text-2xl font-medium text-white mb-6 flex items-center">
                <Eye className="w-6 h-6 text-blue-400 mr-3" />
                How AR Try-On Works
              </h4>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Face Detection', desc: 'Advanced AI detects your facial features', icon: '🎯' },
                  { step: 2, title: 'Real-Time Tracking', desc: 'Tracks 468 facial landmarks at 30+ FPS', icon: '⚡' },
                  { step: 3, title: 'Perfect Alignment', desc: 'Glasses align precisely with your features', icon: '🎪' },
                  { step: 4, title: 'Natural Movement', desc: 'Follows your head movements smoothly', icon: '🌊' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-1">{item.title}</h5>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Browser Compatibility */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h4 className="text-lg font-medium text-white mb-4">Browser Support</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Chrome 90+
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Safari 14+
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Firefox 88+
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Edge 90+
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
            <h3 className="text-3xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Find Your Perfect Frame?
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of eyewear shopping. Try on hundreds of frames virtually, 
              then order with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={openAR}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start AR Try-On
              </motion.button>
              
              <motion.button
                onClick={() => window.location.href = '/shop'}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-600 hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-[#d4af37]/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Collection
                <Eye className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced AR Try-On Modal */}
      <ARTryOn isOpen={isAROpen} onClose={closeAR} />
    </section>
  );
}