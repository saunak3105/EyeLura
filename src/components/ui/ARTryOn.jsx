
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as THREE from 'three';
import { Camera, RotateCcw, Download, AlertCircle, Loader2, X } from 'lucide-react';

// Video background component that shows the camera feed
function VideoBackground({ videoRef }) {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (meshRef.current && videoRef.current && videoRef.current.readyState >= 2) {
      const texture = new THREE.VideoTexture(videoRef.current);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      meshRef.current.material.map = texture;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  );
}

// Glasses component that renders in Three.js scene
function GlassesModel({ faceData, modelPath, videoRef }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const { viewport, camera } = useThree();

  useFrame(() => {
    if (!meshRef.current || !faceData?.landmarks || !videoRef.current) return;

    const landmarks = faceData.landmarks;
    const video = videoRef.current;
    
    // Key facial landmarks for glasses positioning
    const noseBridge = landmarks[168]; // Nose bridge center
    const leftEye = landmarks[33];     // Left eye corner
    const rightEye = landmarks[263];   // Right eye corner

    if (noseBridge && leftEye && rightEye) {
      // Convert MediaPipe normalized coordinates to Three.js world coordinates
      // MediaPipe gives coordinates as (0-1), we need to map to viewport
      const videoAspect = video.videoWidth / video.videoHeight;
      const viewportAspect = viewport.width / viewport.height;
      
      let scaleX = viewport.width;
      let scaleY = viewport.height;
      
      if (videoAspect > viewportAspect) {
        scaleY = viewport.width / videoAspect;
      } else {
        scaleX = viewport.height * videoAspect;
      }

      // Convert normalized coordinates to world space
      const noseX = (noseBridge.x - 0.5) * scaleX;
      const noseY = -(noseBridge.y - 0.5) * scaleY; // Flip Y axis
      const noseZ = (noseBridge.z || 0) * 0.1; // Scale Z depth

      // Position glasses at nose bridge
      meshRef.current.position.set(noseX, noseY, noseZ);

      // Calculate rotation based on eye positions
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + 
        Math.pow(rightEye.y - leftEye.y, 2)
      );
      
      const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
      meshRef.current.rotation.z = -angle; // Flip rotation

      // Scale based on face size
      const scale = eyeDistance * scaleX * 0.8;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene.clone()}
      scale={[1, 1, 1]}
    />
  );
}

// Placeholder glasses models - TODO: Replace with actual .glb files
const GLASSES_MODELS = [
  '/models/glasses1.glb', // TODO: Add actual model paths
  '/models/glasses2.glb',
  '/models/glasses3.glb'
];

const ARTryOn = ({ isOpen, onClose }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceMeshRef = useRef();
  const animationRef = useRef();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [faceData, setFaceData] = useState(null);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  // Check browser compatibility
  useEffect(() => {
    const checkSupport = () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasWebGL = !!document.createElement('canvas').getContext('webgl');
      const isModernBrowser = 'MediaSource' in window;
      
      return hasMediaDevices && hasWebGL && isModernBrowser;
    };

    setIsSupported(checkSupport());
  }, []);

  // Initialize camera and face mesh
  const initializeCamera = useCallback(async () => {
    if (!isSupported) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });
      }

      // Initialize MediaPipe Face Mesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          setFaceData({
            landmarks: results.multiFaceLandmarks[0],
            image: results.image
          });
        } else {
          setFaceData(null);
        }
      });

      faceMeshRef.current = faceMesh;

      // Start processing loop
      const processFrame = async () => {
        if (videoRef.current && faceMeshRef.current && videoRef.current.readyState >= 2) {
          await faceMeshRef.current.send({ image: videoRef.current });
        }
        animationRef.current = requestAnimationFrame(processFrame);
      };

      processFrame();
      setIsLoading(false);

    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError('Failed to access camera. Please check permissions and try again.');
      setIsLoading(false);
    }
  }, [isSupported]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (isOpen && isSupported) {
      initializeCamera();
    }
    
    return cleanup;
  }, [isOpen, isSupported, initializeCamera, cleanup]);

  // Change glasses model
  const changeModel = () => {
    setCurrentModelIndex((prev) => (prev + 1) % GLASSES_MODELS.length);
  };

  // Capture screenshot
  const captureScreenshot = useCallback(() => {
    if (!canvasRef.current) return;

    setIsCapturing(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `eyewear-tryOn-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      }
      setIsCapturing(false);
    }, 100);
  }, []);

  if (!isOpen) return null;

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Your browser doesn't support the required features for AR try-on. 
            Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-full max-h-[90vh] mx-4 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Virtual Try-On</h2>
            <p className="text-gray-600">See how you look in our eyewear</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Camera View */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white">Initializing camera...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                <div className="text-center text-white max-w-md px-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={initializeCamera}
                    className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Hidden video element for camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="hidden"
            />

            {/* Three.js Canvas */}
            <div ref={canvasRef} className="w-full h-full">
              <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                
                {/* Video background */}
                <VideoBackground videoRef={videoRef} />
                
                {/* Glasses overlay */}
                {faceData && (
                  <GlassesModel
                    faceData={faceData}
                    modelPath={GLASSES_MODELS[currentModelIndex]}
                    videoRef={videoRef}
                  />
                )}
              </Canvas>
            </div>

            {/* Face detection indicator */}
            {!isLoading && !error && (
              <div className="absolute top-4 left-4">
                <div className={`flex items-center px-3 py-2 rounded-lg ${
                  faceData ? 'bg-green-500' : 'bg-yellow-500'
                } text-white text-sm font-medium`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    faceData ? 'bg-white' : 'bg-white animate-pulse'
                  }`} />
                  {faceData ? 'Face Detected' : 'Looking for face...'}
                </div>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={changeModel}
                    disabled={isLoading || !!error}
                    className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Change Frame
                  </button>

                  <button
                    onClick={captureScreenshot}
                    disabled={isLoading || !!error || !faceData || isCapturing}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCapturing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5 mr-2" />
                    )}
                    {isCapturing ? 'Capturing...' : 'Save Photo'}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Frame</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="w-16 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">
                      Frame {currentModelIndex + 1} of {GLASSES_MODELS.length}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Tips</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting</li>
                  <li>• Stay within the frame</li>
                  <li>• Move slowly for best tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preload GLTF models - these will fail until you add actual model files
GLASSES_MODELS.forEach((modelPath) => {
  try {
    useGLTF.preload(modelPath);
  } catch (e) {
    console.warn(`Failed to preload model: ${modelPath}`);
  }
});

export default ARTryOn;
