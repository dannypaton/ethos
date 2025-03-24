import { Variants, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Custom hook that provides reusable animation variants for Framer Motion
 * with support for reduced motion preferences
 * 
 * @returns An object containing animation variants for common use cases
 */
export const useAnimations = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();
  
  // Default transition for use across animations
  const getDefaultTransition = (duration = 0.7, delay = 0) => {
    // Return minimal or no animation when reduced motion is preferred
    if (prefersReducedMotion) {
      return {
        duration: 0.1,
        delay: 0,
        ease: 'linear'
      };
    }
    
    // Normal animation transition
    return {
      duration,
      delay,
      ease: [0.25, 0.1, 0.25, 1] // Cubic bezier easing
    };
  };
  
  /**
   * Fade in from bottom animation
   */
  const fadeInUp: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: (custom = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: getDefaultTransition(0.7, custom * 0.2)
    })
  };

  /**
   * Fade in from top animation
   */
  const fadeInDown: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -30 
    },
    visible: (custom = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: getDefaultTransition(0.7, custom * 0.2)
    })
  };

  /**
   * Fade in with scale animation
   */
  const fadeInScale: Variants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.9 
    },
    visible: (custom = 0) => ({ 
      opacity: 1, 
      scale: 1, 
      transition: getDefaultTransition(0.5, custom * 0.2)
    })
  };

  /**
   * Staggered children animation for parent containers
   */
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: prefersReducedMotion ? 0.1 : 0.2,
        delayChildren: 0.1,
        when: 'beforeChildren' 
      }
    }
  };

  /**
   * Animation for revealing content on scroll
   */
  const scrollReveal: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 75 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: getDefaultTransition(0.8)
    }
  };

  /**
   * Animation for menu items
   */
  const menuItem: Variants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : -20 
    },
    visible: (custom = 0) => ({ 
      opacity: 1, 
      x: 0, 
      transition: getDefaultTransition(0.4, custom * 0.1)
    }),
    exit: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : -20,
      transition: getDefaultTransition(0.3)
    }
  };

  /**
   * Animation for modal overlay
   */
  const modalOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: getDefaultTransition(0.3)
    },
    exit: { 
      opacity: 0,
      transition: getDefaultTransition(0.2)
    }
  };

  /**
   * Animation for modal content
   */
  const modalContent: Variants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: getDefaultTransition(0.4)
    },
    exit: { 
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: getDefaultTransition(0.3)
    }
  };

  return {
    fadeInUp,
    fadeInDown,
    fadeInScale,
    staggerContainer,
    scrollReveal,
    menuItem,
    modalOverlay,
    modalContent
  };
};

export default useAnimations; 