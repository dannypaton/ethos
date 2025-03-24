import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Button from './Button';
import useAnimations from '@/hooks/useAnimations';

interface VideoModalProps {
  /**
   * URL of the video to play
   */
  src: string;
  
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Function to call when closing the modal
   */
  onClose: () => void;
}

/**
 * A reusable, accessible video modal component with animations
 */
const VideoModal: React.FC<VideoModalProps> = ({ src, isOpen, onClose }) => {
  const { modalOverlay, modalContent } = useAnimations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation and focus trapping
  useEffect(() => {
    // Auto-play video when modal opens
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(error => console.log('Video autoplay error:', error));
    }
    
    // Focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Close on escape
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Save previous active element to restore focus later
    const previousActiveElement = document.activeElement as HTMLElement;
    
    // Focus the modal container when it opens
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
    
    // When modal closes, return focus to the element that had it before
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (!isOpen && previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);
  
  // Stop video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);
  
  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={handleOverlayClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalOverlay}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-label="Video player"
        >
          <motion.div 
            className="relative w-full max-w-4xl aspect-video"
            variants={modalContent}
          >
            <Button
              variant="icon"
              className="absolute -top-10 right-0 text-white p-2"
              onClick={onClose}
              ariaLabel="Close video"
            >
              <Image
                src="/images/icon-close.svg"
                alt="Close"
                width={24}
                height={24}
              />
            </Button>
            <video 
              ref={videoRef}
              controls 
              className="w-full h-full"
              aria-label="Video content"
            >
              <source src={src} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal; 