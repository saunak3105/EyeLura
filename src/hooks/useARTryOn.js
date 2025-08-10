import { useState, useCallback, useEffect } from 'react';

export const useARTryOn = () => {
  const [isAROpen, setIsAROpen] = useState(false);
  const [isARSupported, setIsARSupported] = useState(true);
  const [browserInfo, setBrowserInfo] = useState(null);

  // Check browser compatibility on mount
  useEffect(() => {
    const checkARSupport = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      const hasWebGL = !!gl;
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasWebAssembly = typeof WebAssembly === 'object';
      
      // Browser detection
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 0;
      
      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browser = 'Chrome';
        version = parseInt(ua.match(/Chrome\/(\d+)/)?.[1] || '0');
      } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        version = parseInt(ua.match(/Firefox\/(\d+)/)?.[1] || '0');
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
        version = parseInt(ua.match(/Version\/(\d+)/)?.[1] || '0');
      } else if (ua.includes('Edg')) {
        browser = 'Edge';
        version = parseInt(ua.match(/Edg\/(\d+)/)?.[1] || '0');
      }

      const browserSupported = (
        (browser === 'Chrome' && version >= 90) ||
        (browser === 'Firefox' && version >= 88) ||
        (browser === 'Safari' && version >= 14) ||
        (browser === 'Edge' && version >= 90)
      );

      const supported = hasWebGL && hasGetUserMedia && hasWebAssembly && browserSupported;
      
      setIsARSupported(supported);
      setBrowserInfo({ browser, version, supported: browserSupported });
      
      return supported;
    };

    checkARSupport();
  }, []);

  const openAR = useCallback(() => {
    if (!isARSupported) {
      console.warn('AR not supported on this device/browser');
      return;
    }
    setIsAROpen(true);
  }, [isARSupported]);

  const closeAR = useCallback(() => {
    setIsAROpen(false);
  }, []);

  const toggleAR = useCallback(() => {
    if (isAROpen) {
      closeAR();
    } else {
      openAR();
    }
  }, [isAROpen, openAR, closeAR]);

  return {
    isAROpen,
    isARSupported,
    browserInfo,
    openAR,
    closeAR,
    toggleAR
  };
};