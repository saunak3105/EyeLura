import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, Download, Sparkles, Eye, Settings, RefreshCw, Zap, AlertCircle } from 'lucide-react';

// Enhanced glasses transform calculation with improved stability
function getGlassesTransform(landmarks, viewport, previousTransform = null) {
  if (!landmarks || landmarks.length < 468) return previousTransform;

  // Key facial landmarks for precise positioning
  const leftEyeCenter = landmarks[159];     // Left eye center
  const rightEyeCenter = landmarks[386];    // Right eye center
  const noseBridge = landmarks[168];        // Nose bridge (primary anchor)
  const noseTip = landmarks[1];             // Nose tip
  const leftEyeOuter = landmarks[33];       // Left eye outer corner
  const rightEyeOuter = landmarks[263];     // Right eye outer corner
  const leftTemple = landmarks[234];        // Left temple area
  const rightTemple = landmarks[454];       // Right temple area
  const forehead = landmarks[10];           // Forehead center

  if (!leftEyeCenter || !rightEyeCenter || !noseBridge) return previousTransform;

  // Calculate eye center midpoint for horizontal positioning
  const eyeCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
  const eyeCenterY = (leftEyeCenter.y + rightEyeCenter.y) / 2;

  // Position glasses slightly above eye center, on the nose bridge
  const glassesX = eyeCenterX;
  const glassesY = eyeCenterY - 0.015; // Slight upward offset for natural placement

  // Convert normalized coordinates to viewport coordinates
  const x = -(glassesX - 0.5) * viewport.width;
  const y = -(glassesY - 0.5) * viewport.height;

  // Enhanced scaling based on inter-eye distance and face depth
  const eyeDistance = Math.sqrt(
    Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) + 
    Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
  );

  // Calculate face depth using nose bridge to forehead distance
  const faceDepth = forehead && noseBridge ? 
    Math.abs(forehead.z - noseBridge.z) : 0.02;

  // Dynamic scaling with depth consideration
  const baseEyeDistance = 0.095; // Average normalized inter-eye distance
  const depthFactor = Math.max(0.8, Math.min(1.2, 1 + (faceDepth - 0.02) * 10));
  const scaleRatio = (eyeDistance / baseEyeDistance) * depthFactor;
  const scale = Math.max(0.6, Math.min(1.8, scaleRatio * 2.2));

  // Enhanced rotation calculation using multiple reference points
  const eyeAngle = Math.atan2(
    rightEyeCenter.y - leftEyeCenter.y,
    rightEyeCenter.x - leftEyeCenter.x
  );

  // Head tilt calculation using temple points
  let headTiltZ = 0;
  if (leftTemple && rightTemple) {
    headTiltZ = Math.atan2(
      rightTemple.y - leftTemple.y,
      rightTemple.x - leftTemple.x
    ) * 0.3; // Reduced influence for stability
  }

  // Head rotation Y (left-right turn)
  let headRotationY = 0;
  if (noseTip && noseBridge) {
    const noseVector = noseTip.x - noseBridge.x;
    headRotationY = noseVector * 0.5; // Convert to rotation
  }

  // Head rotation X (up-down tilt)
  let headRotationX = 0;
  if (forehead && noseTip) {
    const verticalTilt = (forehead.y - noseTip.y) - 0.08; // Normalized vertical distance
    headRotationX = verticalTilt * 2; // Convert to rotation
  }

  const currentTransform = {
    position: [x, y, 0],
    scale: scale,
    rotation: [headRotationX, headRotationY, eyeAngle + headTiltZ]
  };

  // Advanced smoothing with adaptive factors
  if (previousTransform) {
    const positionSmoothing = 0.75;
    const scaleSmoothing = 0.8;
    const rotationSmoothing = 0.7;
    
    return {
      position: [
        previousTransform.position[0] * positionSmoothing + currentTransform.position[0] * (1 - positionSmoothing),
        previousTransform.position[1] * positionSmoothing + currentTransform.position[1] * (1 - positionSmoothing),
        0
      ],
      scale: previousTransform.scale * scaleSmoothing + currentTransform.scale * (1 - scaleSmoothing),
      rotation: [
        previousTransform.rotation[0] * rotationSmoothing + currentTransform.rotation[0] * (1 - rotationSmoothing),
        previousTransform.rotation[1] * rotationSmoothing + currentTransform.rotation[1] * (1 - rotationSmoothing),
        previousTransform.rotation[2] * rotationSmoothing + currentTransform.rotation[2] * (1 - rotationSmoothing)
      ]
    };
  }

  return currentTransform;
}

// Enhanced 3D Glasses Component with multiple styles
function Glasses({ faceData, selectedGlasses, isVisible }) {
  const glassesRef = useRef();
  const previousTransformRef = useRef(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (glassesRef.current && faceData && faceData.landmarks && isVisible) {
      const transform = getGlassesTransform(
        faceData.landmarks, 
        viewport, 
        previousTransformRef.current
      );
      
      if (transform) {
        previousTransformRef.current = transform;
        
        // Smooth position updates
        glassesRef.current.position.set(...transform.position);
        glassesRef.current.scale.setScalar(transform.scale);
        glassesRef.current.rotation.set(...transform.rotation);
      }
    }
  });

  const getGlassesStyle = () => {
    switch(selectedGlasses) {
      case 'aviator': 
        return { 
          frameColor: '#C0C0C0',
          lensColor: '#1a1a1a',
          lensOpacity: 0.3,
          frameThickness: 0.06,
          shape: 'aviator'
        };
      case 'round': 
        return { 
          frameColor: '#8B4513',
          lensColor: '#2F4F4F',
          lensOpacity: 0.25,
          frameThickness: 0.08,
          shape: 'round'
        };
      case 'square': 
        return { 
          frameColor: '#000000',
          lensColor: '#191970',
          lensOpacity: 0.2,
          frameThickness: 0.1,
          shape: 'square'
        };
      case 'cateye': 
        return { 
          frameColor: '#8B0000',
          lensColor: '#4B0082',
          lensOpacity: 0.3,
          frameThickness: 0.09,
          shape: 'cateye'
        };
      default: 
        return { 
          frameColor: '#333333',
          lensColor: '#87CEEB',
          lensOpacity: 0.2,
          frameThickness: 0.08,
          shape: 'classic'
        };
    }
  };

  const style = getGlassesStyle();

  const renderGlassesShape = () => {
    switch(style.shape) {
      case 'aviator':
        return (
          <>
            {/* Aviator teardrop shape */}
            <mesh position={[-0.65, 0, 0]}>
              <sphereGeometry args={[0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshBasicMaterial color={style.frameColor} wireframe />
            </mesh>
            <mesh position={[-0.65, 0, -0.01]}>
              <sphereGeometry args={[0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
            <mesh position={[0.65, 0, 0]}>
              <sphereGeometry args={[0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshBasicMaterial color={style.frameColor} wireframe />
            </mesh>
            <mesh position={[0.65, 0, -0.01]}>
              <sphereGeometry args={[0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
          </>
        );
      
      case 'round':
        return (
          <>
            {/* Perfect circles */}
            <mesh position={[-0.6, 0, 0]}>
              <ringGeometry args={[0.32, 0.4, 32]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[-0.6, 0, -0.01]}>
              <circleGeometry args={[0.32, 32]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
            <mesh position={[0.6, 0, 0]}>
              <ringGeometry args={[0.32, 0.4, 32]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[0.6, 0, -0.01]}>
              <circleGeometry args={[0.32, 32]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
          </>
        );

      case 'square':
        return (
          <>
            {/* Square frames */}
            <mesh position={[-0.65, 0, 0]}>
              <ringGeometry args={[0.35, 0.43, 4]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[-0.65, 0, -0.01]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
            <mesh position={[0.65, 0, 0]}>
              <ringGeometry args={[0.35, 0.43, 4]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[0.65, 0, -0.01]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
          </>
        );

      case 'cateye':
        return (
          <>
            {/* Cat eye shape */}
            <mesh position={[-0.6, 0, 0]} rotation={[0, 0, 0.2]}>
              <ringGeometry args={[0.3, 0.38, 6]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[-0.6, 0, -0.01]} rotation={[0, 0, 0.2]}>
              <circleGeometry args={[0.3, 6]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
            <mesh position={[0.6, 0, 0]} rotation={[0, 0, -0.2]}>
              <ringGeometry args={[0.3, 0.38, 6]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[0.6, 0, -0.01]} rotation={[0, 0, -0.2]}>
              <circleGeometry args={[0.3, 6]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
          </>
        );

      default:
        return (
          <>
            {/* Classic oval frames */}
            <mesh position={[-0.65, 0, 0]}>
              <ringGeometry args={[0.35, 0.43, 32]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[-0.65, 0, -0.01]}>
              <circleGeometry args={[0.35, 32]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
            <mesh position={[0.65, 0, 0]}>
              <ringGeometry args={[0.35, 0.43, 32]} />
              <meshBasicMaterial color={style.frameColor} />
            </mesh>
            <mesh position={[0.65, 0, -0.01]}>
              <circleGeometry args={[0.35, 32]} />
              <meshBasicMaterial color={style.lensColor} transparent opacity={style.lensOpacity} />
            </mesh>
          </>
        );
    }
  };

  return (
    <group ref={glassesRef}>
      {/* Render glasses shape */}
      {renderGlassesShape()}

      {/* Enhanced nose bridge */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.2, 0.06, style.frameThickness]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>

      {/* Improved nose pads */}
      <mesh position={[-0.12, -0.08, 0.02]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>
      <mesh position={[0.12, -0.08, 0.02]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>

      {/* Enhanced temples with proper curvature */}
      <mesh position={[-1.0, 0.05, 0]} rotation={[0, 0, Math.PI / 15]}>
        <boxGeometry args={[0.7, style.frameThickness, style.frameThickness]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>
      <mesh position={[1.0, 0.05, 0]} rotation={[0, 0, -Math.PI / 15]}>
        <boxGeometry args={[0.7, style.frameThickness, style.frameThickness]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>

      {/* Temple hinges with better detail */}
      <mesh position={[-0.85, 0.02, 0]}>
        <cylinderGeometry args={[0.03, 0.03, style.frameThickness * 1.5, 8]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>
      <mesh position={[0.85, 0.02, 0]}>
        <cylinderGeometry args={[0.03, 0.03, style.frameThickness * 1.5, 8]} />
        <meshBasicMaterial color={style.frameColor} />
      </mesh>
    </group>
  );
}

// Performance monitoring component
function PerformanceMonitor({ onFPSUpdate }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      onFPSUpdate(fps);
      frameCount.current = 0;
      lastTime.current = currentTime;
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

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [selectedGlasses, setSelectedGlasses] = useState('classic');
  const [cameraMode, setCameraMode] = useState('user'); // 'user' or 'environment'
  const [isGlassesVisible, setIsGlassesVisible] = useState(true);
  const [fps, setFPS] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [initializationStep, setInitializationStep] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [smoothingEnabled, setSmoothingEnabled] = useState(true);

  // Available glasses styles
  const glassesStyles = [
    { id: 'classic', name: 'Classic', icon: '👓', color: '#333333' },
    { id: 'aviator', name: 'Aviator', icon: '🕶️', color: '#C0C0C0' },
    { id: 'round', name: 'Round', icon: '⭕', color: '#8B4513' },
    { id: 'square', name: 'Square', icon: '⬛', color: '#000000' },
    { id: 'cateye', name: 'Cat Eye', icon: '😸', color: '#8B0000' }
  ];

  // Initialize MediaPipe and camera
  const initializeAR = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setInitializationStep('Loading MediaPipe...');

      // Initialize MediaPipe with optimized settings
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      setInitializationStep('Creating face detector...');
      
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: false, // Disable for better performance
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceLandmarkerRef.current = landmarker;
      setInitializationStep('Accessing camera...');

      // Setup camera with enhanced constraints
      const constraints = {
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: cameraMode,
          frameRate: { ideal: 30, max: 60 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setInitializationStep('Starting face detection...');
          setTimeout(() => {
            setIsLoading(false);
            startFaceDetection();
          }, 500);
        };
      }

    } catch (err) {
      console.error('AR initialization error:', err);
      let errorMessage = 'Failed to initialize AR: ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera access denied. Please allow camera permissions and try again.';
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

  // Enhanced face detection with performance optimization
  const startFaceDetection = useCallback(() => {
    let lastDetectionTime = 0;
    const detectionInterval = 1000 / 30; // 30 FPS target

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
          const results = faceLandmarkerRef.current.detectForVideo(
            videoRef.current, 
            currentTime
          );

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            
            setFaceData({
              landmarks: landmarks,
              confidence: 1.0, // MediaPipe doesn't provide confidence in this version
              timestamp: currentTime
            });
            
            if (!faceDetected) {
              setFaceDetected(true);
            }
          } else {
            if (faceDetected) {
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
  }, [isOpen, faceDetected]);

  // Camera mode switching
  const switchCamera = useCallback(async () => {
    const newMode = cameraMode === 'user' ? 'environment' : 'user';
    setCameraMode(newMode);
    
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Reinitialize with new camera
    await initializeAR();
  }, [cameraMode, initializeAR]);

  // Capture screenshot
  const captureScreenshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip horizontally for selfie camera
      if (cameraMode === 'user') {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      
      context.drawImage(video, 0, 0);

      // Download the image
      const link = document.createElement('a');
      link.download = `eyelura-tryout-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, [cameraMode]);

  // Reset AR session
  const resetAR = useCallback(() => {
    setFaceData(null);
    setFaceDetected(false);
    setSelectedGlasses('classic');
    setIsGlassesVisible(true);
  }, []);

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
  }, []);

  // Initialize when modal opens
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
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  AR Virtual Try-On
                </h2>
                <p className="text-sm text-gray-400">Experience eyewear in real-time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* FPS Counter */}
              {fps > 0 && (
                <div className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                  {fps} FPS
                </div>
              )}
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-800/50 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800/50 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Main AR View */}
            <div className="flex-1 p-6">
              {error ? (
                /* Error State */
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-3">Camera Access Required</h3>
                    <p className="text-red-400 mb-6 text-sm leading-relaxed">{error}</p>
                    <div className="space-y-3">
                      <button 
                        onClick={initializeAR}
                        className="w-full px-6 py-3 bg-[#d4af37] hover:bg-[#e6c14d] text-black rounded-lg font-medium transition-all duration-300"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Try Again
                      </button>
                      <p className="text-xs text-gray-500">
                        Make sure to allow camera access when prompted
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* AR Camera View */
                <div className="relative">
                  {/* Loading Overlay */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <h3 className="text-lg font-medium text-white mb-2">Initializing AR</h3>
                          <p className="text-sm text-gray-400">{initializationStep}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Video Container */}
                  <div className="relative w-full h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
                    <video 
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ transform: cameraMode === 'user' ? 'scaleX(-1)' : 'none' }}
                      playsInline
                      muted
                    />

                    {/* 3D Glasses Overlay */}
                    <div className="absolute inset-0">
                      <Canvas
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        style={{ background: 'transparent' }}
                        gl={{ 
                          antialias: true, 
                          alpha: true,
                          powerPreference: "high-performance"
                        }}
                      >
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} intensity={0.4} />
                        <Glasses 
                          faceData={faceData} 
                          selectedGlasses={selectedGlasses}
                          isVisible={isGlassesVisible}
                        />
                        <PerformanceMonitor onFPSUpdate={setFPS} />
                      </Canvas>
                    </div>

                    {/* Status Indicators */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {/* Face Detection Status */}
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm ${
                        faceDetected 
                          ? 'bg-green-500/20 border border-green-400/30' 
                          : 'bg-red-500/20 border border-red-400/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          faceDetected ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-white text-xs font-medium">
                          {faceDetected ? 'Face Detected' : 'No Face'}
                        </span>
                      </div>

                      {/* Camera Mode Indicator */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full">
                        <Camera className="w-3 h-3 text-gray-400" />
                        <span className="text-white text-xs">
                          {cameraMode === 'user' ? 'Front' : 'Back'} Camera
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <AnimatePresence>
                      {!faceDetected && !isLoading && (
                        <motion.div
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                        >
                          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
                            <p className="text-white text-sm text-center">
                              <Eye className="w-4 h-4 inline mr-2" />
                              Position your face in the camera view
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Control Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-3">
                      {/* Toggle Glasses Visibility */}
                      <motion.button
                        onClick={() => setIsGlassesVisible(!isGlassesVisible)}
                        className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                          isGlassesVisible 
                            ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]' 
                            : 'bg-gray-900/50 border-gray-700/50 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>

                      {/* Switch Camera */}
                      <motion.button
                        onClick={switchCamera}
                        className="p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.button>

                      {/* Capture Screenshot */}
                      <motion.button
                        onClick={captureScreenshot}
                        className="p-3 bg-[#d4af37]/20 backdrop-blur-sm border border-[#d4af37]/50 rounded-full text-[#d4af37] hover:bg-[#d4af37]/30 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:w-80 border-l border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
              <div className="p-6 space-y-6">
                
                {/* Glasses Selection */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-[#d4af37] mr-2" />
                    Choose Style
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {glassesStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        onClick={() => setSelectedGlasses(style.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedGlasses === style.id
                            ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/25'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">{style.icon}</div>
                        <div className={`text-sm font-medium ${
                          selectedGlasses === style.id ? 'text-[#d4af37]' : 'text-gray-300'
                        }`}>
                          {style.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
                        <h4 className="text-white font-medium">Settings</h4>
                        
                        {/* Smoothing Toggle */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Face Smoothing</span>
                          <button
                            onClick={() => setSmoothingEnabled(!smoothingEnabled)}
                            className={`w-12 h-6 rounded-full transition-all duration-300 ${
                              smoothingEnabled ? 'bg-[#d4af37]' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                              smoothingEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    How to Use
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">1.</span>
                      <span>Position your face in the camera view</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">2.</span>
                      <span>Wait for face detection (green indicator)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">3.</span>
                      <span>Select different eyewear styles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">4.</span>
                      <span>Move your head to test the fit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">5.</span>
                      <span>Capture screenshots to save your look</span>
                    </li>
                  </ul>
                </div>

                {/* Performance Info */}
                {faceDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 rounded-xl p-4 border border-green-400/20"
                  >
                    <h4 className="text-green-400 font-medium mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Tracking Active
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Frame Rate:</span>
                        <span className="text-green-400">{fps} FPS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Face Confidence:</span>
                        <span className="text-green-400">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tracking Quality:</span>
                        <span className="text-green-400">Excellent</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={resetAR}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Session
                  </motion.button>
                  
                  <motion.button
                    onClick={captureScreenshot}
                    disabled={!faceDetected}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#d4af37] hover:bg-[#e6c14d] disabled:bg-gray-600 disabled:cursor-not-allowed text-black rounded-xl font-medium transition-all duration-300"
                    whileHover={{ scale: faceDetected ? 1.02 : 1 }}
                    whileTap={{ scale: faceDetected ? 0.98 : 1 }}
                  >
                    <Download className="w-4 h-4" />
                    Save Photo
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden canvas for screenshots */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ARTryOn;