import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles } from 'lucide-react';

// Calculate glasses transform based on facial landmarks
function getGlassesTransform(landmarks, viewport, previousTransform = null) {
  if (!landmarks || landmarks.length < 264) return previousTransform;

  // Get key facial landmarks
  const leftEye = landmarks[33];      // Left eye outer corner
  const rightEye = landmarks[263];    // Right eye outer corner
  const noseTip = landmarks[1];       // Nose tip - primary anchor
  const noseBridge = landmarks[168];  // Nose bridge (between eyebrows)
  const chin = landmarks[152];        // Chin for rotation reference
  const leftEyebrow = landmarks[70];  // Left eyebrow
  const rightEyebrow = landmarks[107]; // Right eyebrow

  if (!leftEye || !rightEye || !noseTip) return previousTransform;

  // Calculate horizontal center between eyes
  const eyeMidpointX = (leftEye.x + rightEye.x) / 2;
  
  // Use nose bridge as primary vertical anchor, fallback to nose tip
  let verticalAnchor = noseBridge || noseTip;
  
  // Fine-tune vertical position: glasses should sit slightly above nose tip
  // but below the eyebrows, resting on the nose bridge
  let glassesY = verticalAnchor.y;
  
  // If we have eyebrow landmarks, position glasses between eyebrows and nose
  if (leftEyebrow && rightEyebrow) {
    const eyebrowMidY = (leftEyebrow.y + rightEyebrow.y) / 2;
    // Position glasses 60% of the way from eyebrows to nose bridge
    glassesY = eyebrowMidY + (verticalAnchor.y - eyebrowMidY) * 0.6;
  } else {
    // Fallback: position slightly above nose tip
    glassesY = noseTip.y - 0.02; // Small upward offset from nose tip
  }

  // Convert normalized coordinates to viewport coordinates
  const x = -(eyeMidpointX - 0.5) * viewport.width;
  const y = -(glassesY - 0.5) * viewport.height;

  // Calculate inter-eye distance for dynamic scaling
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) + 
    Math.pow(rightEye.y - leftEye.y, 2)
  );
  
  // Improved scaling based on face width
  // Average inter-eye distance is about 0.1 in normalized coordinates
  const normalizedEyeDistance = 0.1;
  const scaleRatio = eyeDistance / normalizedEyeDistance;
  const baseScale = 2.5; // Adjusted base scale
  const scale = Math.max(0.5, Math.min(2.0, scaleRatio * baseScale));

  // Enhanced rotation calculation using multiple reference points
  let rotationAngle = 0;
  
  // Primary rotation: eye alignment
  const eyeAngle = Math.atan2(
    rightEye.y - leftEye.y,
    rightEye.x - leftEye.x
  );
  
  // Secondary rotation: nose-to-chin vector for head tilt
  if (chin) {
    const noseToChainAngle = Math.atan2(
      chin.x - noseTip.x,
      chin.y - noseTip.y
    );
    // Blend eye angle (70%) with nose-chin angle (30%) for natural rotation
    rotationAngle = eyeAngle * 0.7 + noseToChainAngle * 0.3;
  } else {
    rotationAngle = eyeAngle;
  }

  const currentTransform = {
    position: [x, y, 0],
    scale: scale,
    rotation: [0, 0, rotationAngle]
  };

  // Apply smoothing to reduce jitter
  if (previousTransform) {
    const smoothingFactor = 0.7; // Higher = more smoothing
    
    return {
      position: [
        previousTransform.position[0] * smoothingFactor + currentTransform.position[0] * (1 - smoothingFactor),
        previousTransform.position[1] * smoothingFactor + currentTransform.position[1] * (1 - smoothingFactor),
        0
      ],
      scale: previousTransform.scale * smoothingFactor + currentTransform.scale * (1 - smoothingFactor),
      rotation: [
        0,
        0,
        previousTransform.rotation[2] * smoothingFactor + currentTransform.rotation[2] * (1 - smoothingFactor)
      ]
    };
  }

  return currentTransform;
}

// Enhanced glasses component with improved facial alignment
function Glasses({ faceData, selectedGlasses }) {
  const glassesRef = useRef();
  const previousTransformRef = useRef(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (glassesRef.current && faceData && faceData.landmarks) {
      const transform = getGlassesTransform(
        faceData.landmarks, 
        viewport, 
        previousTransformRef.current
      );
      
      if (transform) {
        // Store current transform for next frame smoothing
        previousTransformRef.current = transform;
        
        // Apply position
        glassesRef.current.position.set(...transform.position);
        
        // Apply scale
        glassesRef.current.scale.setScalar(transform.scale);
        
        // Apply rotation for head tilt
        glassesRef.current.rotation.set(...transform.rotation);
      }
    }
  });

  // Different glasses styles with enhanced properties
  const getGlassesStyle = () => {
    switch(selectedGlasses) {
      case 'classic': 
        return { 
          color: '#333333', 
          lensOpacity: 0.2,
          frameThickness: 0.08 
        };
      case 'modern': 
        return { 
          color: '#1a1a1a', 
          lensOpacity: 0.15,
          frameThickness: 0.06 
        };
      case 'vintage': 
        return { 
          color: '#8B4513', 
          lensOpacity: 0.25,
          frameThickness: 0.1 
        };
      default: 
        return { 
          color: '#333333', 
          lensOpacity: 0.2,
          frameThickness: 0.08 
        };
    }
  };

 const style = getGlassesStyle();

  return (
    <group ref={glassesRef}>
      {/* Left lens frame */}
      <mesh position={[-0.7, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color={style.color} />
      </mesh>
      
      {/* Left lens */}
      <mesh position={[-0.7, 0, -0.01]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={style.lensOpacity}
        />
      </mesh>

      {/* Right lens frame */}
      <mesh position={[0.7, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color={style.color} />
      </mesh>
      
      {/* Right lens */}
      <mesh position={[0.7, 0, -0.01]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={style.lensOpacity}
        />
      </mesh>

      {/* Nose bridge */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.25, 0.08, style.frameThickness]} />
        <meshBasicMaterial color={style.color} />
      </mesh>

      {/* Nose pads */}
      <mesh position={[-0.15, -0.1, 0.02]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={style.color} />
      </mesh>
      <mesh position={[0.15, -0.1, 0.02]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={style.color} />
      </mesh>

      {/* Left temple */}
      <mesh position={[-1.1, 0.1, 0]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.8, style.frameThickness, style.frameThickness]} />
        <meshBasicMaterial color={style.color} />
      </mesh>

      {/* Right temple */}
      <mesh position={[1.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.8, style.frameThickness, style.frameThickness]} />
        <meshBasicMaterial color={style.color} />
      </mesh>

      {/* Temple hinges */}
      <mesh position={[-0.9, 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, style.frameThickness * 2, 8]} />
        <meshBasicMaterial color={style.color} />
      </mesh>
      <mesh position={[0.9, 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, style.frameThickness * 2, 8]} />
        <meshBasicMaterial color={style.color} />
      </mesh>
    </group>
  );
}

function ARTryOn({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [selectedGlasses, setSelectedGlasses] = useState('classic');

  useEffect(() => {
    if (!isOpen) return;

    let animationId;
    let stream;

    const setupFaceDetection = async () => {
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
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        setFaceLandmarker(landmarker);

        // Setup camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsLoading(false);
            detectFace();
          };
        }

      } catch (err) {
        console.error('Setup error:', err);
        setError(`Failed to initialize: ${err.message}`);
        setIsLoading(false);
      }
    };

    const detectFace = () => {
      if (faceLandmarker && videoRef.current && videoRef.current.videoWidth > 0) {
        try {
          const startTime = performance.now();
          const results = faceLandmarker.detectForVideo(videoRef.current, startTime);

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];

            // Store all landmarks for improved positioning
            setFaceData({
              landmarks: landmarks,
              // Keep legacy format for backward compatibility
              leftEye: landmarks[33] ? { x: landmarks[33].x, y: landmarks[33].y } : null,
              rightEye: landmarks[263] ? { x: landmarks[263].x, y: landmarks[263].y } : null,
              noseTip: landmarks[1] ? { x: landmarks[1].x, y: landmarks[1].y } : null
            });
          }
        } catch (err) {
          console.error('Detection error:', err);
        }
      }

      if (isOpen) {
        animationId = requestAnimationFrame(detectFace);
      }
    };

    setupFaceDetection();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-[#d4af37] mr-3" />
              <h2 className="text-2xl font-light text-white" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                AR Try-On Experience
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {error ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-400 text-xl mb-4">⚠️</div>
                  <p className="text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }} 
                    className="px-4 py-2 bg-[#d4af37] text-black rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Glasses Selection */}
                <div className="mb-6">
                  <h4 className="text-lg text-white mb-3" 
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Choose Style:
                  </h4>
                  <div className="flex gap-3 justify-center">
                    {['classic', 'modern', 'vintage'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedGlasses(style)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedGlasses === style 
                            ? 'bg-[#d4af37] text-black' 
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AR Camera View */}
                <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Initializing AR Camera...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Element */}
                  <video 
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                    playsInline
                    muted
                  />

                  {/* 3D Glasses Overlay */}
                  <div className="absolute inset-0">
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      style={{ background: 'transparent' }}
                    >
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <Glasses faceData={faceData} selectedGlasses={selectedGlasses} />
                    </Canvas>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      faceData && faceData.landmarks ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                      {faceData && faceData.landmarks ? 'Tracking' : 'No Face'}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm" 
                     style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {faceData 
                      ? 'Face detected! Move your head to see how the glasses fit.' 
                      : 'Please look directly at the camera for face detection.'
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ARTryOn;
