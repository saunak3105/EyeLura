
import { useState, useCallback } from 'react';

export const useARTryOn = () => {
  const [isAROpen, setIsAROpen] = useState(false);

  const openAR = useCallback(() => {
    setIsAROpen(true);
  }, []);

  const closeAR = useCallback(() => {
    setIsAROpen(false);
  }, []);

  const toggleAR = useCallback(() => {
    setIsAROpen(prev => !prev);
  }, []);

  return {
    isAROpen,
    openAR,
    closeAR,
    toggleAR
  };
};
