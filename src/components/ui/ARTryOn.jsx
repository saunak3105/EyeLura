import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, Download, Sparkles, Eye, Settings, RefreshCw, Zap, AlertCircle, Volume2, VolumeX } from 'lucide-react';

// Enhanced ML-optimized glasses transform with Adam-like smoothing
class AdaptiveTracker {
  constructor() {
    this.momentum = { position: [0, 0, 0], scale: 0, rotation: [0, 0, 0] };
    this.velocity = { position: [0, 0, 0], scale: 0, rotation: [0, 0, 0] };
    this.learningRate = 0.15; // Increased learning rate for faster adaptation
    this.beta1 = 0.9; // Adam optimizer momentum parameter
    this.beta2 = 0.999; // Adam optimizer velocity parameter
    this.epsilon = 1e-8; // Small constant for numerical stability
    this.t = 0; // Time step for bias correction
  }

  update(currentTransform, previousTransform) {
    if (!previousTransform) return currentTransform;
    
    this.t += 1;
    
    // Calculate gradients (differences)
    const gradients = {
      position: [
        currentTransform.position[0] - previousTransform.position[0],
        currentTransform.position[1] - previousTransform.position[1],
        currentTransform.position[2] - previousTransform.position[2]
      ],
      scale: currentTransform.scale - previousTransform.scale,
      rotation: [
        currentTransform.rotation[0] - previousTransform.rotation[0],
        currentTransform.rotation[1] - previousTransform.rotation[1],
        currentTransform.rotation[2] - previousTransform.rotation[2]
      ]
    };

    // Adam optimizer updates
    const updateParam = (param, gradient, momentum, velocity) => {
      // Update biased first moment estimate
      momentum = this.beta1 * momentum + (1 - this.beta1) * gradient;
      
      // Update biased second raw moment estimate
      velocity = this.beta2 * velocity + (1 - this.beta2) * gradient * gradient;
      
      // Compute bias-corrected first moment estimate
      const mHat = momentum / (1 - Math.pow(this.beta1, this.t));
      
      // Compute bias-corrected second raw moment estimate
      const vHat = velocity / (1 - Math.pow(this.beta2, this.t));
      
      // Update parameter
      const update = this.learningRate * mHat / (Math.sqrt(vHat) + this.epsilon);
      
      return { newParam: param + update, momentum, velocity };
    };

    // Update position
    for (let i = 0; i < 3; i++) {
      const result = updateParam(
        previousTransform.position[i],
        gradients.position[i],
        this.momentum.position[i],
        this.velocity.position[i]
      );
      previousTransform.position[i] = result.newParam;
      this.momentum.position[i] = result.momentum;
      this.velocity.position[i] = result.velocity;
    }

    // Update scale
    const scaleResult = updateParam(
      previousTransform.scale,
      gradients.scale,
      this.momentum.scale,
      this.velocity.scale
    );
    previousTransform.scale = scaleResult.newParam;
    this.momentum.scale = scaleResult.momentum;
    this.velocity.scale = scaleResult.velocity;

    // Update rotation
    for (let i = 0; i < 3; i++) {
      const result = updateParam(
        previousTransform.rotation[i],
        gradients.rotation[i],
        this.momentum.rotation[i],
        this.velocity.rotation[i]
      );
      previousTransform.rotation[i] = result.newParam;
      this.momentum.rotation[i] = result.momentum;
      this.velocity.rotation[i] = result.velocity;
    }

    return previousTransform;
  }
}

// Enhanced glasses transform with precise nose bridge alignment
function getOptimizedGlassesTransform(landmarks, viewport, tracker) {
  if (!landmarks || landmarks.length < 468) return null;

  // Critical facial landmarks for precise nose bridge alignment
  const noseBridge = landmarks[168];        // Primary anchor point
  const leftEyeInner = landmarks[133];      // Left eye inner corner
  const rightEyeInner = landmarks[362];     // Right eye inner corner
  const leftEyeCenter = landmarks[159];     // Left eye center
  const rightEyeCenter = landmarks[386];    // Right eye center
  const noseTip = landmarks[1];             // Nose tip for depth
  const leftTemple = landmarks[234];        // Left temple
  const rightTemple = landmarks[454];       // Right temple
  const forehead = landmarks[10];           // Forehead center

  if (!noseBridge || !leftEyeInner || !rightEyeInner) return null;

  // Calculate precise nose bridge position
  const bridgeX = noseBridge.x;
  const bridgeY = noseBridge.y - 0.008; // Slight upward offset for natural placement

  // Enhanced inter-eye distance calculation for better scaling
  const eyeInnerDistance = Math.sqrt(
    Math.pow(rightEyeInner.x - leftEyeInner.x, 2) + 
    Math.pow(rightEyeInner.y - leftEyeInner.y, 2)
  );

  // Face depth estimation using multiple reference points
  const faceDepth = forehead && noseTip ? 
    Math.abs(forehead.z - noseTip.z) : 0.02;

  // Advanced scaling with depth compensation
  const baseEyeDistance = 0.065; // Optimized for nose bridge alignment
  const depthFactor = Math.max(0.85, Math.min(1.15, 1 + (faceDepth - 0.02) * 8));
  const scaleRatio = (eyeInnerDistance / baseEyeDistance) * depthFactor;
  const scale = Math.max(0.7, Math.min(1.6, scaleRatio * 2.8));

  // Convert to viewport coordinates
  const x = -(bridgeX - 0.5) * viewport.width;
  const y = -(bridgeY - 0.5) * viewport.height;

  // Enhanced rotation calculation for stable tracking
  const eyeAngle = Math.atan2(
    rightEyeCenter.y - leftEyeCenter.y,
    rightEyeCenter.x - leftEyeCenter.x
  );

  // Head tilt using temple points with stability enhancement
  let headTiltZ = 0;
  if (leftTemple && rightTemple) {
    headTiltZ = Math.atan2(
      rightTemple.y - leftTemple.y,
      rightTemple.x - leftTemple.x
    ) * 0.25; // Reduced for stability
  }

  // Head rotation Y (left-right turn) with nose bridge reference
  let headRotationY = 0;
  if (noseTip && noseBridge) {
    const noseVector = (noseTip.x - noseBridge.x) * 2;
    headRotationY = Math.max(-0.5, Math.min(0.5, noseVector)); // Clamped for stability
  }

  // Head rotation X (up-down tilt) with forehead reference
  let headRotationX = 0;
  if (forehead && noseBridge) {
    const verticalTilt = (forehead.y - noseBridge.y) - 0.085;
    headRotationX = Math.max(-0.3, Math.min(0.3, verticalTilt * 1.5)); // Clamped
  }

  const currentTransform = {
    position: [x, y, 0],
    scale: scale,
    rotation: [headRotationX, headRotationY, eyeAngle + headTiltZ]
  };

  // Apply Adam optimizer-like smoothing
  return tracker.update(currentTransform, tracker.previousTransform || currentTransform);
}

// Modern 3D Glasses Component with enhanced materials
function ModernGlasses({ faceData, selectedGlasses, isVisible, tracker }) {
  const glassesRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (glassesRef.current && faceData && faceData.landmarks && isVisible) {
      const transform = getOptimizedGlassesTransform(faceData.landmarks, viewport, tracker);
      
      if (transform) {
        tracker.previousTransform = transform;
        
        // Apply smooth transforms
        glassesRef.current.position.set(...transform.position);
        glassesRef.current.scale.setScalar(transform.scale);
        glassesRef.current.rotation.set(...transform.rotation);
      }
    }
  });

  const getGlassesStyle = () => {
    const styles = {
      aviator: { 
        frameColor: '#E8E8E8', lensColor: '#1a1a2e', lensOpacity: 0.4,
        frameThickness: 0.04, shape: 'aviator', metallic: true
      },
      round: { 
        frameColor: '#8B4513', lensColor: '#2F4F4F', lensOpacity: 0.3,
        frameThickness: 0.06, shape: 'round', metallic: false
      },
      square: { 
        frameColor: '#1a1a1a', lensColor: '#191970', lensOpacity: 0.25,
        frameThickness: 0.08, shape: 'square', metallic: false
      },
      cateye: { 
        frameColor: '#8B0000', lensColor: '#4B0082', lensOpacity: 0.35,
        frameThickness: 0.07, shape: 'cateye', metallic: false
      },
      classic: { 
        frameColor: '#2c2c2c', lensColor: '#87CEEB', lensOpacity: 0.25,
        frameThickness: 0.06, shape: 'classic', metallic: false
      }
    };
    return styles[selectedGlasses] || styles.classic;
  };

  const style = getGlassesStyle();

  const renderLens = (position, rotation = [0, 0, 0]) => (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <ringGeometry args={[0.32, 0.38, 32]} />
        <meshStandardMaterial 
          color={style.frameColor} 
          metalness={style.metallic ? 0.8 : 0.1}
          roughness={style.metallic ? 0.2 : 0.6}
        />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial 
          color={style.lensColor} 
          transparent 
          opacity={style.lensOpacity}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={glassesRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      
      {/* Enhanced lens rendering based on style */}
      {style.shape === 'aviator' ? (
        <>
          {renderLens([-0.6, 0, 0])}
          {renderLens([0.6, 0, 0])}
        </>
      ) : style.shape === 'cateye' ? (
        <>
          {renderLens([-0.55, 0, 0], [0, 0, 0.15])}
          {renderLens([0.55, 0, 0], [0, 0, -0.15])}
        </>
      ) : (
        <>
          {renderLens([-0.6, 0, 0])}
          {renderLens([0.6, 0, 0])}
        </>
      )}

      {/* Enhanced nose bridge with better positioning */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.16, 0.04, style.frameThickness]} />
        <meshStandardMaterial 
          color={style.frameColor}
          metalness={style.metallic ? 0.8 : 0.1}
          roughness={style.metallic ? 0.2 : 0.6}
        />
      </mesh>

      {/* Optimized nose pads */}
      <mesh position={[-0.08, -0.06, 0.015]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={style.frameColor} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.08, -0.06, 0.015]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={style.frameColor} opacity={0.8} transparent />
      </mesh>

      {/* Enhanced temples with realistic curvature */}
      <mesh position={[-0.9, 0.02, 0]} rotation={[0, 0, Math.PI / 20]}>
        <boxGeometry args={[0.6, style.frameThickness, style.frameThickness]} />
        <meshStandardMaterial 
          color={style.frameColor}
          metalness={style.metallic ? 0.8 : 0.1}
          roughness={style.metallic ? 0.2 : 0.6}
        />
      </mesh>
      <mesh position={[0.9, 0.02, 0]} rotation={[0, 0, -Math.PI / 20]}>
        <boxGeometry args={[0.6, style.frameThickness, style.frameThickness]} />
        <meshStandardMaterial 
          color={style.frameColor}
          metalness={style.metallic ? 0.8 : 0.1}
          roughness={style.metallic ? 0.2 : 0.6}
        />
      </mesh>

      {/* Premium hinges */}
      <mesh position={[-0.78, 0.01, 0]}>
        <cylinderGeometry args={[0.025, 0.025, style.frameThickness * 1.2, 8]} />
        <meshStandardMaterial color={style.frameColor} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.78, 0.01, 0]}>
        <cylinderGeometry args={[0.025, 0.025, style.frameThickness * 1.2, 8]} />
        <meshStandardMaterial color={style.frameColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Performance monitor with ML metrics
function PerformanceMonitor({ onMetricsUpdate }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const detectionTimes = useRef([]);

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      const avgDetectionTime = detectionTimes.current.length > 0 
        ? detectionTimes.current.reduce((a, b) => a + b, 0) / detectionTimes.current.length 
        : 0;
      
      onMetricsUpdate({ fps, avgDetectionTime: avgDetectionTime.toFixed(2) });
      
      frameCount.current = 0;
      lastTime.current = currentTime;
      detectionTimes.current = [];
    }
  });

  return null;
}

function ARTryOn({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const trackerRef = useRef(new AdaptiveTracker());

  // Enhanced state management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [selectedGlasses, setSelectedGlasses] = useState('classic');
  const [cameraMode, setCameraMode] = useState('user');
  const [isGlassesVisible, setIsGlassesVisible] = useState(true);
  const [metrics, setMetrics] = useState({ fps: 0, avgDetectionTime: 0 });
  const [faceDetected, setFaceDetected] = useState(false);
  const [initializationStep, setInitializationStep] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [trackingQuality, setTrackingQuality] = useState('excellent');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Modern glasses collection with enhanced styling
  const glassesStyles = [
    { 
      id: 'classic', 
      name: 'Classic', 
      icon: '👓', 
      color: '#2c2c2c',
      description: 'Timeless elegance'
    },
    { 
      id: 'aviator', 
      name: 'Aviator', 
      icon: '🕶️', 
      color: '#E8E8E8',
      description: 'Bold & confident'
    },
    { 
      id: 'round', 
      name: 'Round', 
      icon: '⭕', 
      color: '#8B4513',
      description: 'Vintage charm'
    },
    { 
      id: 'square', 
      name: 'Square', 
      icon: '⬛', 
      color: '#1a1a1a',
      description: 'Modern edge'
    },
    { 
      id: 'cateye', 
      name: 'Cat Eye', 
      icon: '😸', 
      color: '#8B0000',
      description: 'Sophisticated flair'
    }
  ];

  // Enhanced initialization with optimized ML settings
  const initializeAR = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setInitializationStep('Initializing ML models...');

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      setInitializationStep('Optimizing face detection...');
      
      // Enhanced ML configuration with optimized parameters
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.7, // Increased for better quality
        minFacePresenceConfidence: 0.8,  // Increased for stability
        minTrackingConfidence: 0.8       // Increased for consistent tracking
      });

      faceLandmarkerRef.current = landmarker;
      setInitializationStep('Accessing camera...');

      // Enhanced camera constraints for better ML performance
      const constraints = {
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: cameraMode,
          frameRate: { ideal: 30, max: 60 },
          aspectRatio: { ideal: 16/9 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setInitializationStep('Calibrating tracking...');
          setTimeout(() => {
            setIsLoading(false);
            startOptimizedFaceDetection();
          }, 800);
        };
      }

    } catch (err) {
      console.error('AR initialization error:', err);
      let errorMessage = 'Failed to initialize AR: ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera access denied. Please allow camera permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [cameraMode]);

  // Optimized face detection with enhanced performance
  const startOptimizedFaceDetection = useCallback(() => {
    let lastDetectionTime = 0;
    const targetFPS = 30;
    const detectionInterval = 1000 / targetFPS;
    let consecutiveDetections = 0;
    let consecutiveMisses = 0;

    const detectFace = () => {
      const currentTime = performance.now();
      
      if (currentTime - lastDetectionTime < detectionInterval) {
        if (isOpen) {
          animationFrameRef.current = requestAnimationFrame(detectFace);
        }
        return;
      }

      if (faceLandmarkerRef.current && videoRef.current && 
          videoRef.current.videoWidth > 0 && videoRef.current.readyState === 4) {
        try {
          const detectionStart = performance.now();
          const results = faceLandmarkerRef.current.detectForVideo(
            videoRef.current, 
            currentTime
          );
          const detectionTime = performance.now() - detectionStart;

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            
            // Quality assessment based on landmark stability
            consecutiveDetections++;
            consecutiveMisses = 0;
            
            const quality = consecutiveDetections > 10 ? 'excellent' : 
                          consecutiveDetections > 5 ? 'good' : 'fair';
            
            setTrackingQuality(quality);
            
            setFaceData({
              landmarks: landmarks,
              confidence: Math.min(1.0, consecutiveDetections / 15),
              timestamp: currentTime,
              detectionTime
            });
            
            if (!faceDetected) {
              setFaceDetected(true);
              if (soundEnabled) {
                // Play subtle detection sound
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
              }
            }
          } else {
            consecutiveMisses++;
            consecutiveDetections = Math.max(0, consecutiveDetections - 1);
            
            if (consecutiveMisses > 10 && faceDetected) {
              setFaceDetected(false);
            }
          }
          
          lastDetectionTime = currentTime;
        } catch (err) {
          console.error('Face detection error:', err);
        }
      }

      if (isOpen) {
        animationFrameRef.current = requestAnimationFrame(detectFace);
      }
    };

    detectFace();
  }, [isOpen, faceDetected, soundEnabled]);

  // Enhanced camera switching
  const switchCamera = useCallback(async () => {
    const newMode = cameraMode === 'user' ? 'environment' : 'user';
    setCameraMode(newMode);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Reset tracker for new camera
    trackerRef.current = new AdaptiveTracker();
    await initializeAR();
  }, [cameraMode, initializeAR]);

  // Enhanced screenshot with better quality
  const captureScreenshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      // High quality capture
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Apply filters for better quality
      context.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
      
      if (cameraMode === 'user') {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      
      context.drawImage(video, 0, 0);

      // Add subtle watermark
      context.filter = 'none';
      context.fillStyle = 'rgba(212, 175, 55, 0.8)';
      context.font = '16px Inter';
      context.fillText('EyeLura AR Try-On', 20, canvas.height - 20);

      const link = document.createElement('a');
      link.download = `eyelura-ar-tryout-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
    }
  }, [cameraMode]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (faceLandmarkerRef.current) {
      faceLandmarkerRef.current.close();
    }
    // Reset tracker
    trackerRef.current = new AdaptiveTracker();
  }, []);

  useEffect(() => {
    if (isOpen) {
      initializeAR();
    } else {
      cleanup();
    }
    return cleanup;
  }, [isOpen, initializeAR, cleanup]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative w-full h-full max-w-7xl mx-auto flex flex-col bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Immersive Header */}
          <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '300' }}>
                  AR Virtual Try-On
                </h2>
                <p className="text-sm text-gray-400">Powered by advanced ML tracking</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Enhanced Status Indicators */}
              <div className="flex items-center gap-3">
                {metrics.fps > 0 && (
                  <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-xs text-green-400 font-medium">{metrics.fps} FPS</span>
                  </div>
                )}
                
                <div className={`px-3 py-1 rounded-full border backdrop-blur-sm ${
                  faceDetected 
                    ? 'bg-green-500/20 border-green-400/40 text-green-400' 
                    : 'bg-red-500/20 border-red-400/40 text-red-400'
                }`}>
                  <span className="text-xs font-medium">
                    {faceDetected ? 'Tracking Active' : 'No Face'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          <div className="flex-1 flex">
            {/* Main AR Viewport */}
            <div className="flex-1 p-6">
              {error ? (
                <motion.div 
                  className="h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center max-w-md bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-3">Camera Access Required</h3>
                    <p className="text-red-400 mb-6 text-sm leading-relaxed">{error}</p>
                    <motion.button 
                      onClick={initializeAR}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-2xl font-medium transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Retry Connection
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="relative h-full">
                  {/* Loading Overlay */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-yellow-400/30 rounded-full"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-2">Initializing AR</h3>
                          <p className="text-sm text-gray-400">{initializationStep}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Video Container */}
                  <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl">
                    <video 
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ transform: cameraMode === 'user' ? 'scaleX(-1)' : 'none' }}
                      playsInline
                      muted
                    />

                    {/* Enhanced 3D Overlay */}
                    <div className="absolute inset-0">
                      <Canvas
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        style={{ background: 'transparent' }}
                        gl={{ 
                          antialias: true, 
                          alpha: true,
                          powerPreference: "high-performance",
                          preserveDrawingBuffer: true
                        }}
                      >
                        <ModernGlasses 
                          faceData={faceData} 
                          selectedGlasses={selectedGlasses}
                          isVisible={isGlassesVisible}
                          tracker={trackerRef.current}
                        />
                        <PerformanceMonitor onMetricsUpdate={setMetrics} />
                      </Canvas>
                    </div>

                    {/* Modern Status HUD */}
                    <div className="absolute top-6 left-6 space-y-3">
                      <motion.div 
                        className={`flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                          faceDetected 
                            ? 'bg-green-500/20 border-green-400/40' 
                            : 'bg-red-500/20 border-red-400/40'
                        }`}
                        animate={{ scale: faceDetected ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          faceDetected ? 'bg-green-400' : 'bg-red-400'
                        } ${faceDetected ? 'animate-pulse' : ''}`}></div>
                        <span className="text-white text-sm font-medium">
                          {faceDetected ? 'Face Locked' : 'Searching...'}
                        </span>
                      </motion.div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl">
                        <Camera className="w-4 h-4 text-gray-300" />
                        <span className="text-white text-sm">
                          {cameraMode === 'user' ? 'Front' : 'Back'} Camera
                        </span>
                      </div>

                      {faceDetected && (
                        <motion.div
                          className="px-4 py-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/40 rounded-2xl"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-blue-400 text-sm font-medium">
                            Quality: {trackingQuality}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Floating Controls */}
                    <div className="absolute bottom-6 right-6 flex gap-3">
                      <motion.button
                        onClick={() => setIsGlassesVisible(!isGlassesVisible)}
                        className={`p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                          isGlassesVisible 
                            ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-400' 
                            : 'bg-white/10 border-white/20 text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        onClick={switchCamera}
                        className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        onClick={captureScreenshot}
                        disabled={!faceDetected}
                        className="p-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/40 rounded-2xl text-yellow-400 hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        whileHover={{ scale: faceDetected ? 1.1 : 1 }}
                        whileTap={{ scale: faceDetected ? 0.9 : 1 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Immersive Instructions */}
                    <AnimatePresence>
                      {!faceDetected && !isLoading && (
                        <motion.div
                          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                        >
                          <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                            <p className="text-white text-sm text-center flex items-center gap-2">
                              <Eye className="w-4 h-4 text-yellow-400" />
                              Position your face in the center for optimal tracking
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Sidebar */}
            <motion.div 
              className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="p-6 space-y-6 h-full overflow-y-auto">
                
                {/* Glasses Selection */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    Choose Your Style
                  </h3>
                  
                  <div className="space-y-3">
                    {glassesStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        onClick={() => setSelectedGlasses(style.id)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                          selectedGlasses === style.id
                            ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/25'
                            : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{style.icon}</div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              selectedGlasses === style.id ? 'text-yellow-400' : 'text-white'
                            }`}>
                              {style.name}
                            </div>
                            <div className="text-gray-400 text-sm">{style.description}</div>
                          </div>
                          {selectedGlasses === style.id && (
                            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-4">Advanced Settings</h4>
                        
                        <div className="space-y-4">
                          {/* Sound Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                              <span className="text-gray-300 text-sm">Audio Feedback</span>
                            </div>
                            <button
                              onClick={() => setSoundEnabled(!soundEnabled)}
                              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                soundEnabled ? 'bg-yellow-400' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>

                          {/* Tracking Sensitivity */}
                          <div>
                            <label className="text-gray-300 text-sm mb-2 block">Tracking Sensitivity</label>
                            <input
                              type="range"
                              min="0.1"
                              max="0.3"
                              step="0.05"
                              value={trackerRef.current.learningRate}
                              onChange={(e) => {
                                trackerRef.current.learningRate = parseFloat(e.target.value);
                              }}
                              className="w-full accent-yellow-400"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Stable</span>
                              <span>Responsive</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Performance Metrics */}
                {faceDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-4 border border-green-400/20"
                  >
                    <h4 className="text-green-400 font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      ML Performance
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Frame Rate:</span>
                        <span className="text-green-400 font-medium">{metrics.fps} FPS</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Detection Time:</span>
                        <span className="text-blue-400 font-medium">{metrics.avgDetectionTime}ms</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tracking Quality:</span>
                        <span className={`font-medium ${
                          trackingQuality === 'excellent' ? 'text-green-400' :
                          trackingQuality === 'good' ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {trackingQuality}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>ML Optimizer:</span>
                        <span className="text-purple-400 font-medium">Adam</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Instructions */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-400/20">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Pro Tips
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold text-xs mt-0.5">•</span>
                      <span>Keep your face centered and well-lit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold text-xs mt-0.5">•</span>
                      <span>Move slowly for best tracking accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold text-xs mt-0.5">•</span>
                      <span>Try different angles to test the fit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold text-xs mt-0.5">•</span>
                      <span>Capture screenshots to compare styles</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={() => {
                      trackerRef.current = new AdaptiveTracker();
                      setFaceData(null);
                      setFaceDetected(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Tracking
                  </motion.button>
                  
                  <motion.button
                    onClick={captureScreenshot}
                    disabled={!faceDetected}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 rounded-2xl font-medium transition-all duration-300"
                    whileHover={{ scale: faceDetected ? 1.02 : 1 }}
                    whileTap={{ scale: faceDetected ? 0.98 : 1 }}
                  >
                    <Download className="w-4 h-4" />
                    Capture Look
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hidden canvas for screenshots */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ARTryOn;