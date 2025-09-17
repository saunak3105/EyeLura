import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, RotateCcw, Download, Settings, Eye, EyeOff, 
  RotateCw, ZoomIn, ZoomOut, Loader2, AlertCircle, 
  CheckCircle, Maximize2, Minimize2, RefreshCw 
} from 'lucide-react';

// Enhanced smoothing algorithm for stable tracking
class EnhancedTracker {
  constructor() {
    this.history = [];
    this.maxHistory = 8;
    this.smoothingFactor = 0.7;
    this.velocityDamping = 0.85;
    this.previousTransform = null;
    this.velocity = { position: [0, 0, 0], scale: 0, rotation: [0, 0, 0] };
  }

  update(currentTransform) {
    if (!this.previousTransform) {
      this.previousTransform = { ...currentTransform };
      return currentTransform;
    }

    // Calculate velocity
    this.velocity.position = [
      (currentTransform.position[0] - this.previousTransform.position[0]) * this.velocityDamping,
      (currentTransform.position[1] - this.previousTransform.position[1]) * this.velocityDamping,
      (currentTransform.position[2] - this.previousTransform.position[2]) * this.velocityDamping
    ];
    this.velocity.scale = (currentTransform.scale - this.previousTransform.scale) * this.velocityDamping;
    this.velocity.rotation = [
      (currentTransform.rotation[0] - this.previousTransform.rotation[0]) * this.velocityDamping,
      (currentTransform.rotation[1] - this.previousTransform.rotation[1]) * this.velocityDamping,
      (currentTransform.rotation[2] - this.previousTransform.rotation[2]) * this.velocityDamping
    ];

    // Apply smoothing with velocity prediction
    const smoothed = {
      position: [
        this.previousTransform.position[0] + (currentTransform.position[0] - this.previousTransform.position[0]) * this.smoothingFactor + this.velocity.position[0] * 0.1,
        this.previousTransform.position[1] + (currentTransform.position[1] - this.previousTransform.position[1]) * this.smoothingFactor + this.velocity.position[1] * 0.1,
        this.previousTransform.position[2] + (currentTransform.position[2] - this.previousTransform.position[2]) * this.smoothingFactor + this.velocity.position[2] * 0.1
      ],
      scale: this.previousTransform.scale + (currentTransform.scale - this.previousTransform.scale) * this.smoothingFactor + this.velocity.scale * 0.1,
      rotation: [
        this.previousTransform.rotation[0] + (currentTransform.rotation[0] - this.previousTransform.rotation[0]) * this.smoothingFactor + this.velocity.rotation[0] * 0.1,
        this.previousTransform.rotation[1] + (currentTransform.rotation[1] - this.previousTransform.rotation[1]) * this.smoothingFactor + this.velocity.rotation[1] * 0.1,
        this.previousTransform.rotation[2] + (currentTransform.rotation[2] - this.previousTransform.rotation[2]) * this.smoothingFactor + this.velocity.rotation[2] * 0.1
      ]
    };

    this.previousTransform = smoothed;
    return smoothed;
  }

  reset() {
    this.history = [];
    this.previousTransform = null;
    this.velocity = { position: [0, 0, 0], scale: 0, rotation: [0, 0, 0] };
  }
}

// Enhanced auto-scaling with face landmark analysis
function getEnhancedGlassesTransform(landmarks, viewport, manualAdjustments = {}) {
  if (!landmarks || landmarks.length < 468) return null;

  // Key facial landmarks for precise positioning
  const noseBridge = landmarks[168];
  const leftEyeInner = landmarks[133];
  const rightEyeInner = landmarks[362];
  const leftEyeOuter = landmarks[33];
  const rightEyeOuter = landmarks[263];
  const leftTemple = landmarks[234];
  const rightTemple = landmarks[454];
  const noseTip = landmarks[1];
  const forehead = landmarks[10];

  if (!noseBridge || !leftEyeInner || !rightEyeInner) return null;

  // Enhanced auto-scaling based on multiple facial measurements
  const eyeInnerDistance = Math.sqrt(
    Math.pow(rightEyeInner.x - leftEyeInner.x, 2) + 
    Math.pow(rightEyeInner.y - leftEyeInner.y, 2)
  );

  const eyeOuterDistance = Math.sqrt(
    Math.pow(rightEyeOuter.x - leftEyeOuter.x, 2) + 
    Math.pow(rightEyeOuter.y - leftEyeOuter.y, 2)
  );

  const templeDistance = leftTemple && rightTemple ? Math.sqrt(
    Math.pow(rightTemple.x - leftTemple.x, 2) + 
    Math.pow(rightTemple.y - leftTemple.y, 2)
  ) : eyeOuterDistance;

  // Face depth estimation for distance-based scaling
  const faceDepth = forehead && noseTip ? Math.abs(forehead.z - noseTip.z) : 0.02;
  const depthFactor = Math.max(0.8, Math.min(1.3, 1 + (faceDepth - 0.02) * 10));

  // Intelligent scaling algorithm
  const baseEyeDistance = 0.065;
  const scaleFromEyes = (eyeInnerDistance / baseEyeDistance) * depthFactor;
  const scaleFromTemples = (templeDistance / 0.12) * depthFactor;
  
  // Weighted average for more stable scaling
  const autoScale = (scaleFromEyes * 0.7 + scaleFromTemples * 0.3) * 2.5;
  const finalScale = Math.max(0.6, Math.min(2.0, autoScale)) * (manualAdjustments.scale || 1);

  // Precise positioning
  const bridgeX = noseBridge.x;
  const bridgeY = noseBridge.y - 0.01;

  const x = -(bridgeX - 0.5) * viewport.width;
  const y = -(bridgeY - 0.5) * viewport.height;

  // Enhanced rotation calculations
  const eyeAngle = Math.atan2(
    rightEyeInner.y - leftEyeInner.y,
    rightEyeInner.x - leftEyeInner.x
  );

  let headTiltZ = 0;
  if (leftTemple && rightTemple) {
    headTiltZ = Math.atan2(
      rightTemple.y - leftTemple.y,
      rightTemple.x - leftTemple.x
    ) * 0.3;
  }

  let headRotationY = 0;
  if (noseTip && noseBridge) {
    const noseVector = (noseTip.x - noseBridge.x) * 1.5;
    headRotationY = Math.max(-0.6, Math.min(0.6, noseVector));
  }

  let headRotationX = 0;
  if (forehead && noseBridge) {
    const verticalTilt = (forehead.y - noseBridge.y) - 0.08;
    headRotationX = Math.max(-0.4, Math.min(0.4, verticalTilt * 2));
  }

  return {
    position: [
      x + (manualAdjustments.offsetX || 0),
      y + (manualAdjustments.offsetY || 0),
      manualAdjustments.offsetZ || 0
    ],
    scale: finalScale,
    rotation: [
      headRotationX + (manualAdjustments.rotationX || 0),
      headRotationY + (manualAdjustments.rotationY || 0),
      eyeAngle + headTiltZ + (manualAdjustments.rotationZ || 0)
    ],
    autoScale,
    eyeDistance: eyeInnerDistance,
    faceDepth
  };
}

// Enhanced 3D Glasses Component with GLB model loading
function Enhanced3DGlasses({ faceData, selectedModel, isVisible, tracker, manualAdjustments, onModelLoad, onModelError }) {
  const glassesRef = useRef();
  const { viewport } = useThree();
  const [currentModel, setCurrentModel] = useState(null);

  // Load GLB model
  const gltf = useLoader(GLTFLoader, selectedModel.path, (loader) => {
    loader.manager.onLoad = () => {
      onModelLoad?.(selectedModel.id);
    };
    loader.manager.onError = (error) => {
      onModelError?.(selectedModel.id, error);
    };
  });

  useEffect(() => {
    if (gltf) {
      setCurrentModel(gltf.scene.clone());
    }
  }, [gltf]);

  useFrame(() => {
    if (glassesRef.current && faceData && faceData.landmarks && isVisible && currentModel) {
      const transform = getEnhancedGlassesTransform(faceData.landmarks, viewport, manualAdjustments);
      
      if (transform) {
        const smoothedTransform = tracker.update(transform);
        
        glassesRef.current.position.set(...smoothedTransform.position);
        glassesRef.current.scale.setScalar(smoothedTransform.scale);
        glassesRef.current.rotation.set(...smoothedTransform.rotation);
      }
    }
  });

  if (!currentModel) return null;

  return (
    <group ref={glassesRef}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <primitive object={currentModel} />
    </group>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
      <div className="text-center space-y-6">
        <motion.div
          className="relative w-20 h-20 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-white">Initializing AR Experience</h3>
          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Modal Component
function ErrorModal({ error, onRetry, onClose }) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 border border-red-500/50 rounded-2xl p-8 max-w-md mx-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-3">AR Initialization Failed</h3>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Model Selection Toolbar
function ModelSelector({ models, selectedModel, onModelChange, isLoading }) {
  return (
    <motion.div
      className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h4 className="text-white text-sm font-medium mb-3">Eyewear Models</h4>
      <div className="flex gap-2">
        {models.map((model) => (
          <motion.button
            key={model.id}
            onClick={() => onModelChange(model)}
            disabled={isLoading}
            className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
              selectedModel.id === model.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/30 hover:border-white/50 bg-white/10'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isLoading ? 1 : 1.1 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            <span className="text-lg">{model.icon}</span>
            {selectedModel.id === model.id && (
              <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Manual Adjustment Controls
function AdjustmentControls({ adjustments, onAdjustmentChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-white hover:bg-white/10 transition-colors duration-300"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Adjustments</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCw className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-white/20 p-4 space-y-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scale Control */}
            <div>
              <label className="text-white text-xs font-medium mb-2 block">Scale</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdjustmentChange('scale', Math.max(0.5, (adjustments.scale || 1) - 0.1))}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors duration-300"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center text-white text-xs">
                  {((adjustments.scale || 1) * 100).toFixed(0)}%
                </div>
                <button
                  onClick={() => onAdjustmentChange('scale', Math.min(2, (adjustments.scale || 1) + 0.1))}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors duration-300"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Position Controls */}
            <div>
              <label className="text-white text-xs font-medium mb-2 block">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAdjustmentChange('offsetY', (adjustments.offsetY || 0) - 0.1)}
                  className="w-full h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↑
                </button>
                <button
                  onClick={() => onAdjustmentChange('offsetY', (adjustments.offsetY || 0) + 0.1)}
                  className="w-full h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↓
                </button>
                <button
                  onClick={() => onAdjustmentChange('offsetX', (adjustments.offsetX || 0) - 0.1)}
                  className="w-full h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ←
                </button>
                <button
                  onClick={() => onAdjustmentChange('offsetX', (adjustments.offsetX || 0) + 0.1)}
                  className="w-full h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  →
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div>
              <label className="text-white text-xs font-medium mb-2 block">Rotation</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onAdjustmentChange('rotationZ', (adjustments.rotationZ || 0) - 0.1)}
                  className="flex-1 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↺
                </button>
                <button
                  onClick={() => onAdjustmentChange('rotationZ', (adjustments.rotationZ || 0) + 0.1)}
                  className="flex-1 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↻
                </button>
              </div>
            </div>

            <button
              onClick={onReset}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-2 rounded-lg text-xs font-medium transition-all duration-300"
            >
              Reset All
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main Toolbar Component
function MainToolbar({ 
  onCapture, 
  onToggleAR, 
  onSwitchCamera, 
  onToggleFullscreen,
  isARVisible, 
  isFullscreen, 
  faceDetected,
  trackingQuality 
}) {
  return (
    <motion.div
      className="absolute bottom-6 right-6 flex gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={onToggleAR}
        className={`p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
          isARVisible 
            ? 'bg-blue-500/20 border-blue-400/40 text-blue-400' 
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isARVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </motion.button>

      <motion.button
        onClick={onSwitchCamera}
        className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={onToggleFullscreen}
        className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </motion.button>

      <motion.button
        onClick={onCapture}
        disabled={!faceDetected}
        className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/40 rounded-2xl text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        whileHover={{ scale: faceDetected ? 1.1 : 1 }}
        whileTap={{ scale: faceDetected ? 0.9 : 1 }}
      >
        <Download className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

// Status Indicator Component
function StatusIndicator({ faceDetected, trackingQuality, fps, cameraMode }) {
  return (
    <motion.div
      className="absolute top-6 right-6 space-y-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Face Detection Status */}
      <motion.div 
        className={`flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
          faceDetected 
            ? 'bg-green-500/20 border-green-400/40' 
            : 'bg-red-500/20 border-red-400/40'
        }`}
        animate={{ scale: faceDetected ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-3 h-3 rounded-full ${
          faceDetected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`} />
        <span className="text-white text-sm font-medium">
          {faceDetected ? 'Tracking Active' : 'No Face Detected'}
        </span>
      </motion.div>

      {/* Performance Metrics */}
      {faceDetected && (
        <motion.div
          className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-xs text-gray-300">
            <span>Quality: <span className={`font-medium ${
              trackingQuality === 'excellent' ? 'text-green-400' :
              trackingQuality === 'good' ? 'text-yellow-400' : 'text-orange-400'
            }`}>{trackingQuality}</span></span>
            <span>FPS: <span className="text-blue-400 font-medium">{fps}</span></span>
            <span className="capitalize">{cameraMode} Cam</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ARTryOn({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const trackerRef = useRef(new EnhancedTracker());

  // Enhanced state management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [cameraMode, setCameraMode] = useState('user');
  const [isARVisible, setIsARVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [trackingQuality, setTrackingQuality] = useState('good');
  const [fps, setFps] = useState(0);
  const [manualAdjustments, setManualAdjustments] = useState({});
  const [modelLoadingStates, setModelLoadingStates] = useState({});

  // Enhanced glasses models with GLB paths
  const glassesModels = [
    { 
      id: 'classic', 
      name: 'Classic Frame', 
      icon: '👓', 
      path: '/models/glasses1.glb',
      description: 'Timeless elegance'
    },
    { 
      id: 'aviator', 
      name: 'Aviator Style', 
      icon: '🕶️', 
      path: '/models/glasses2.glb',
      description: 'Bold confidence'
    },
    { 
      id: 'modern', 
      name: 'Modern Frame', 
      icon: '🤓', 
      path: '/models/glasses3.glb',
      description: 'Contemporary edge'
    }
  ];

  useEffect(() => {
    if (glassesModels.length > 0) {
      setSelectedModel(glassesModels[0]);
    }
  }, []);

  // Enhanced initialization
  const initializeAR = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize MediaPipe
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.8,
        minFacePresenceConfidence: 0.8,
        minTrackingConfidence: 0.8
      });

      faceLandmarkerRef.current = landmarker;

      // Enhanced camera setup
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
          setTimeout(() => {
            setIsLoading(false);
            startFaceDetection();
          }, 1000);
        };
      }

    } catch (err) {
      console.error('AR initialization error:', err);
      let errorMessage = 'Failed to initialize AR experience. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access to use virtual try-on.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += 'Please check your browser compatibility and try again.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [cameraMode]);

  // Enhanced face detection with FPS monitoring
  const startFaceDetection = useCallback(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let consecutiveDetections = 0;
    let consecutiveMisses = 0;

    const detectFace = () => {
      const currentTime = performance.now();
      frameCount++;

      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
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
            
            consecutiveDetections++;
            consecutiveMisses = 0;
            
            // Enhanced quality assessment
            const quality = consecutiveDetections > 15 ? 'excellent' : 
                          consecutiveDetections > 8 ? 'good' : 'fair';
            
            setTrackingQuality(quality);
            
            setFaceData({
              landmarks: landmarks,
              confidence: Math.min(1.0, consecutiveDetections / 20),
              timestamp: currentTime
            });
            
            if (!faceDetected) {
              setFaceDetected(true);
            }
          } else {
            consecutiveMisses++;
            consecutiveDetections = Math.max(0, consecutiveDetections - 2);
            
            if (consecutiveMisses > 15 && faceDetected) {
              setFaceDetected(false);
            }
          }
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

  // Enhanced camera switching
  const switchCamera = useCallback(async () => {
    const newMode = cameraMode === 'user' ? 'environment' : 'user';
    setCameraMode(newMode);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    trackerRef.current.reset();
    await initializeAR();
  }, [cameraMode, initializeAR]);

  // Enhanced screenshot capture
  const captureScreenshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
      
      if (cameraMode === 'user') {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      
      context.drawImage(video, 0, 0);

      // Add watermark
      context.filter = 'none';
      context.fillStyle = 'rgba(212, 175, 55, 0.9)';
      context.font = 'bold 24px Inter';
      context.fillText('EyeLura AR Try-On', 30, canvas.height - 30);

      const link = document.createElement('a');
      link.download = `eyelura-ar-${selectedModel?.id || 'glasses'}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
    }
  }, [cameraMode, selectedModel]);

  // Model change handler
  const handleModelChange = useCallback((model) => {
    setSelectedModel(model);
    setModelLoadingStates(prev => ({ ...prev, [model.id]: 'loading' }));
  }, []);

  // Model load handlers
  const handleModelLoad = useCallback((modelId) => {
    setModelLoadingStates(prev => ({ ...prev, [modelId]: 'loaded' }));
  }, []);

  const handleModelError = useCallback((modelId, error) => {
    console.error(`Failed to load model ${modelId}:`, error);
    setModelLoadingStates(prev => ({ ...prev, [modelId]: 'error' }));
  }, []);

  // Manual adjustment handlers
  const handleAdjustmentChange = useCallback((key, value) => {
    setManualAdjustments(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAdjustments = useCallback(() => {
    setManualAdjustments({});
    trackerRef.current.reset();
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

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
    trackerRef.current.reset();
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
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className={`relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
            isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[80vh]'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-white">AR Virtual Try-On</h2>
                <p className="text-sm text-gray-400">Enhanced with auto-scaling</p>
              </div>
            </motion.div>
            
            <motion.button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Main AR Viewport */}
          <div className="relative flex-1 h-full">
            {/* Video Container */}
            <div className="relative w-full h-full bg-black rounded-b-3xl overflow-hidden">
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: cameraMode === 'user' ? 'scaleX(-1)' : 'none' }}
                playsInline
                muted
              />

              {/* 3D Overlay */}
              {selectedModel && (
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
                    <Enhanced3DGlasses 
                      faceData={faceData} 
                      selectedModel={selectedModel}
                      isVisible={isARVisible}
                      tracker={trackerRef.current}
                      manualAdjustments={manualAdjustments}
                      onModelLoad={handleModelLoad}
                      onModelError={handleModelError}
                    />
                  </Canvas>
                </div>
              )}

              {/* Loading Overlay */}
              <AnimatePresence>
                {isLoading && <LoadingSkeleton />}
              </AnimatePresence>

              {/* Error Modal */}
              <AnimatePresence>
                {error && (
                  <ErrorModal 
                    error={error} 
                    onRetry={initializeAR}
                    onClose={onClose}
                  />
                )}
              </AnimatePresence>

              {/* Model Selector */}
              {!isLoading && !error && (
                <ModelSelector
                  models={glassesModels}
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                  isLoading={modelLoadingStates[selectedModel?.id] === 'loading'}
                />
              )}

              {/* Status Indicator */}
              {!isLoading && !error && (
                <StatusIndicator
                  faceDetected={faceDetected}
                  trackingQuality={trackingQuality}
                  fps={fps}
                  cameraMode={cameraMode}
                />
              )}

              {/* Adjustment Controls */}
              {!isLoading && !error && faceDetected && (
                <AdjustmentControls
                  adjustments={manualAdjustments}
                  onAdjustmentChange={handleAdjustmentChange}
                  onReset={resetAdjustments}
                />
              )}

              {/* Main Toolbar */}
              {!isLoading && !error && (
                <MainToolbar
                  onCapture={captureScreenshot}
                  onToggleAR={() => setIsARVisible(!isARVisible)}
                  onSwitchCamera={switchCamera}
                  onToggleFullscreen={toggleFullscreen}
                  isARVisible={isARVisible}
                  isFullscreen={isFullscreen}
                  faceDetected={faceDetected}
                  trackingQuality={trackingQuality}
                />
              )}

              {/* Instructions Overlay */}
              <AnimatePresence>
                {!faceDetected && !isLoading && !error && (
                  <motion.div
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">Position Your Face</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Center your face in the frame for optimal tracking
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Model Loading Indicator */}
              {selectedModel && modelLoadingStates[selectedModel.id] === 'loading' && (
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <span className="text-white text-sm">Loading {selectedModel.name}...</span>
                  </div>
                </motion.div>
              )}

              {/* Success Notification */}
              {selectedModel && modelLoadingStates[selectedModel.id] === 'loaded' && (
                <motion.div
                  className="absolute top-20 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onAnimationComplete={() => {
                    setTimeout(() => {
                      setModelLoadingStates(prev => ({ ...prev, [selectedModel.id]: 'ready' }));
                    }, 2000);
                  }}
                >
                  <div className="bg-green-500/20 backdrop-blur-xl border border-green-400/40 rounded-2xl px-4 py-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{selectedModel.name} Ready</span>
                  </div>
                </motion.div>
              )}
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