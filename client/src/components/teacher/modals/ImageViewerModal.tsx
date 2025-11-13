"use client";

import { X, ZoomIn, ZoomOut, Maximize2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageRefCurrent extends HTMLDivElement {
  initialPinchDistance?: number;
  initialScale?: number;
}

interface ImageViewerModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewerModal({ imageUrl, isOpen, onClose }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<ImageRefCurrent>(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen]);

  // Close on Escape key - MUST be before any early returns
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Click to zoom into specific area
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (scale === 1) {
      // Zoom in to clicked area
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * -200;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -200;
      setScale(2.5);
      setPosition({ x, y });
    }
  };

  // Scroll zoom with mouse wheel - zoom to cursor position
  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 5);
    
    // Zoom towards cursor position
    if (newScale !== scale) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const factor = newScale / scale - 1;
      setPosition(prev => ({
        x: prev.x - x * factor,
        y: prev.y - y * factor
      }));
      setScale(newScale);
    }
  };

  // Touch/pinch zoom for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      imageRef.current.initialPinchDistance = distance;
      imageRef.current.initialScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      // Single touch drag
      setIsDragging(true);
      setStartDrag({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && imageRef.current) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const initialDistance = imageRef.current.initialPinchDistance;
      const initialScale = imageRef.current.initialScale;
      if (initialDistance) {
        const newScale = Math.min(Math.max((distance / initialDistance) * initialScale, 0.5), 5);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      e.preventDefault();
      setPosition({ 
        x: e.touches[0].clientX - startDrag.x, 
        y: e.touches[0].clientY - startDrag.y 
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({ x: e.clientX - startDrag.x, y: e.clientY - startDrag.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.3, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.3, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button - Always Visible */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="text-white">
                  <h3 className="text-lg font-semibold">Image Viewer</h3>
                  <p className="text-sm text-gray-300">Click to zoom • Scroll to zoom • Drag to pan • ESC to close</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 backdrop-blur-sm"
                >
                  <X size={24} />
                </Button>
              </div>
            </div>

            {/* Image Container */}
            <div
              ref={imageRef}
              className="flex-1 flex items-center justify-center p-4 overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                src={imageUrl}
                alt="Zoomable Image"
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : scale === 1 ? 'zoom-in' : 'default',
                }}
                onClick={handleImageClick}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                draggable={false}
                whileTap={{ scale: scale > 1 ? scale * 0.98 : scale }}
              />
            </div>

            {/* Modern Control Panel - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="max-w-md mx-auto">
                {/* Zoom Level Indicator */}
                <div className="text-center mb-3">
                  <span className="text-white text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="lg"
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-xl h-12 w-12 p-0"
                    title="Zoom Out"
                  >
                    <ZoomOut size={20} />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleReset}
                    disabled={scale === 1 && position.x === 0 && position.y === 0 && rotation === 0}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-xl h-12 px-6"
                    title="Reset View"
                  >
                    <Maximize2 size={18} className="mr-2" />
                    Reset
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleZoomIn}
                    disabled={scale >= 5}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-xl h-12 w-12 p-0"
                    title="Zoom In"
                  >
                    <ZoomIn size={20} />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleRotate}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-xl h-12 w-12 p-0"
                    title="Rotate 90°"
                  >
                    <RotateCw size={20} />
                  </Button>
                </div>

                {/* Zoom Slider */}
                <div className="mt-4">
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((scale - 0.5) / 4.5) * 100}%, rgba(255,255,255,0.2) ${((scale - 0.5) / 4.5) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
