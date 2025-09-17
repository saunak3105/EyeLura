import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, RotateCw, ZoomIn, ZoomOut, Move, 
  RotateCcw, Sliders, RefreshCw, Eye, Camera 
} from 'lucide-react';

// Floating Control Panel Component
export function FloatingControls({ 
  adjustments, 
  onAdjustmentChange, 
  onReset, 
  isVisible = true 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-white hover:bg-white/10 transition-colors duration-300"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">Fine Tune</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCw className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-white/20 p-4 space-y-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scale Control */}
            <ControlGroup
              icon={<ZoomIn className="w-4 h-4" />}
              label="Scale"
              value={adjustments.scale || 1}
              onDecrease={() => onAdjustmentChange('scale', Math.max(0.5, (adjustments.scale || 1) - 0.05))}
              onIncrease={() => onAdjustmentChange('scale', Math.min(2, (adjustments.scale || 1) + 0.05))}
              displayValue={`${((adjustments.scale || 1) * 100).toFixed(0)}%`}
            />

            {/* Position Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white text-xs font-medium">
                <Move className="w-4 h-4" />
                <span>Position</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onAdjustmentChange('offsetY', (adjustments.offsetY || 0) - 0.05)}
                  className="h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↑
                </button>
                <div></div>
                <button
                  onClick={() => onAdjustmentChange('offsetX', (adjustments.offsetX || 0) + 0.05)}
                  className="h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  →
                </button>
                <button
                  onClick={() => onAdjustmentChange('offsetX', (adjustments.offsetX || 0) - 0.05)}
                  className="h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ←
                </button>
                <button
                  onClick={() => onAdjustmentChange('offsetY', (adjustments.offsetY || 0) + 0.05)}
                  className="h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xs transition-colors duration-300"
                >
                  ↓
                </button>
                <div></div>
              </div>
            </div>

            {/* Rotation Control */}
            <ControlGroup
              icon={<RotateCcw className="w-4 h-4" />}
              label="Rotation"
              value={adjustments.rotationZ || 0}
              onDecrease={() => onAdjustmentChange('rotationZ', (adjustments.rotationZ || 0) - 0.05)}
              onIncrease={() => onAdjustmentChange('rotationZ', (adjustments.rotationZ || 0) + 0.05)}
              displayValue={`${((adjustments.rotationZ || 0) * 57.3).toFixed(0)}°`}
            />

            {/* Reset Button */}
            <motion.button
              onClick={onReset}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset All Adjustments
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Reusable Control Group Component
function ControlGroup({ icon, label, value, onDecrease, onIncrease, displayValue }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white text-xs font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onDecrease}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut className="w-3 h-3" />
        </motion.button>
        <div className="flex-1 text-center text-white text-xs font-mono bg-white/5 py-2 rounded-lg">
          {displayValue}
        </div>
        <motion.button
          onClick={onIncrease}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
}

// Model Preview Card Component
export function ModelPreviewCard({ model, isSelected, isLoading, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(model)}
      disabled={isLoading}
      className={`relative w-20 h-20 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
          : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
    >
      {/* Model Icon/Preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">{model.icon}</span>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sliders className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-400 rounded-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Model Name */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-gray-300 font-medium">{model.name}</span>
      </div>
    </motion.button>
  );
}

// Performance Monitor Component
export function PerformanceMonitor({ fps, trackingQuality, autoScale, eyeDistance }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="absolute top-20 right-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-white hover:bg-white/10 transition-colors duration-300"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">Metrics</span>
        </div>
        <span className="text-xs text-gray-400">{fps} FPS</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-white/20 p-3 space-y-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Frame Rate:</span>
              <span className="text-green-400 font-medium">{fps} FPS</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Tracking:</span>
              <span className={`font-medium ${
                trackingQuality === 'excellent' ? 'text-green-400' :
                trackingQuality === 'good' ? 'text-yellow-400' : 'text-orange-400'
              }`}>
                {trackingQuality}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Auto Scale:</span>
              <span className="text-blue-400 font-medium">{(autoScale * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Eye Distance:</span>
              <span className="text-purple-400 font-medium">{(eyeDistance * 1000).toFixed(1)}px</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}