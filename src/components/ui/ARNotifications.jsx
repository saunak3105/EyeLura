import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Notification System
export function ARToast({ notifications, onDismiss }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-lg max-w-sm ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-400/40 text-green-400'
                : notification.type === 'error'
                ? 'bg-red-500/20 border-red-400/40 text-red-400'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-400'
            }`}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex-shrink-0">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {notification.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{notification.title}</p>
              {notification.message && (
                <p className="text-xs opacity-80 mt-1">{notification.message}</p>
              )}
            </div>
            
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Instruction Overlay Component
export function InstructionOverlay({ isVisible, step = 'position' }) {
  const instructions = {
    position: {
      title: 'Position Your Face',
      message: 'Center your face in the frame for optimal tracking',
      icon: '👤'
    },
    calibrating: {
      title: 'Calibrating...',
      message: 'Hold still while we optimize the fit',
      icon: '⚙️'
    },
    ready: {
      title: 'Ready to Try On!',
      message: 'Move naturally to test different angles',
      icon: '✨'
    }
  };

  const instruction = instructions[step] || instructions.position;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-center max-w-sm">
            <div className="text-3xl mb-2">{instruction.icon}</div>
            <h3 className="text-white font-medium mb-1">{instruction.title}</h3>
            <p className="text-gray-300 text-sm">{instruction.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Camera Switch Animation
export function CameraSwitchOverlay({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Camera className="w-16 h-16 text-white" />
            </motion.div>
            <h3 className="text-xl font-medium text-white mb-2">Switching Camera</h3>
            <p className="text-gray-400 text-sm">Please wait while we initialize the new camera...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}