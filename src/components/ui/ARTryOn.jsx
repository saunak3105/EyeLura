import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles } from 'lucide-react';

// Simple glasses component using basic geometry
function Glasses({ faceData, selectedGlasses }) {
  const glassesRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (glassesRef.current && faceData) {
      const leftEye = faceData.leftEye;
      const rightEye = faceData.rightEye;

      if (leftEye && rightEye) {
        const centerX = (leftEye.x + rightEye.x) / 2;
        const centerY = (leftEye.y + rightEye.y) / 2;

        const x = (centerX - 0.5) * viewport.width;
        const y = -(centerY - 0.5) * viewport.height;

        glassesRef.current.position.set(x, y + 0.2, 0);

        const eyeDistance = Math.abs(rightEye.x - leftEye.x);
        const scale = eyeDistance * 8;
        glassesRef.current.scale.setScalar(scale);
      }
    }
  });

  // Different glasses styles
  const getGlassesColor = () => {
    switch(selectedGlasses) {
      case 'classic': return '#333333';
      case 'modern': return '#1a1a1a';
      case 'vintage': return '#8B4513';
      default: return '#333333';
    }
  };

  const color = getGlassesColor();

  return (
    <group ref={glassesRef}>
      {/* Left lens */}
      <mesh position={[-0.8, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Right lens */}
      <mesh position={[0.8, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Left temple */}
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Right temple */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshBasicMaterial color={color} />
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

            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            setFaceData({
              leftEye: { x: leftEye.x, y: leftEye.y },
              rightEye: { x: rightEye.x, y: rightEye.y },
              landmarks: landmarks
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
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 rounded-full ${faceData ? 'bg-green-400' : 'bg-red-400'}`}></div>
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