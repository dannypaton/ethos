import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Configure ScrollTrigger with common settings
 */
export const configureScrollTrigger = () => {
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true
  });
};

/**
 * Refresh all ScrollTrigger instances
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh(true);
};

/**
 * Clean up all ScrollTrigger instances
 */
export const cleanupScrollTrigger = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};