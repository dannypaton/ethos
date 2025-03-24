import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  /**
   * URL of the video to display as background
   */
  src: string;
  
  /**
   * Additional classes to apply to the container
   */
  className?: string;
  
  /**
   * Additional classes to apply to the overlay
   */
  overlayClassName?: string;
  
  /**
   * Opacity of the overlay (0-1)
   */
  overlayOpacity?: number;
  
  /**
   * Blur amount for the video ('none', 'sm', 'md', 'lg', 'xl')
   */
  blurAmount?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Alternative image to show before video loads or on error
   */
  fallbackImage?: string;
  
  /**
   * Whether to start the video playback automatically
   * @default true
   */
  autoPlay?: boolean;
  
  /**
   * Whether to use low-power mode for mobile devices
   * This will pause the video when not in viewport
   * @default true
   */
  useLowPowerMode?: boolean;
}

/**
 * A reusable video background component with performance optimizations
 */
const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  src, 
  className = '',
  overlayClassName = '',
  overlayOpacity = 0.5,
  blurAmount = 'none',
  fallbackImage,
  autoPlay = true,
  useLowPowerMode = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Handle video loading
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };
    
    const handleError = () => {
      console.error('Video failed to load:', src);
      setIsVideoLoaded(false);
    };
    
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
    };
  }, [src]);
  
  // Handle power-saving mode for mobile devices
  useEffect(() => {
    if (!useLowPowerMode || !videoRef.current) return;
    
    // Create an intersection observer to pause/play video when in/out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting && videoRef.current && autoPlay) {
          // Only play if autoPlay is enabled
          videoRef.current.play().catch(err => {
            console.warn('Video autoplay failed:', err);
          });
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [useLowPowerMode, autoPlay]);
  
  // Create blur class based on prop
  const blurClass = blurAmount !== 'none' ? `blur-${blurAmount}` : '';
  
  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Fallback image if provided */}
      {fallbackImage && !isVideoLoaded && (
        <div 
          className={`absolute inset-0 bg-cover bg-center ${blurClass}`}
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      
      {/* Video element with loading optimization */}
      <video
        ref={videoRef}
        autoPlay={autoPlay && isIntersecting}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${blurClass}`}
        poster={fallbackImage}
        preload="auto"
      >
        <source src={src} type="video/webm" />
      </video>
      
      {/* Overlay with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: overlayOpacity }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 bg-ethos-dark backdrop-blur-sm ${overlayClassName}`}
      />
    </div>
  );
};

export default VideoBackground; 