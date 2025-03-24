'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ManyOne from '@/components/ManyOne';
import Evolution from '@/components/Evolution';
import SkipToContent from '@/components/SkipToContent';
import { configureScrollTrigger, refreshScrollTrigger, cleanupScrollTrigger } from '@/utils/animations';

/**
 * Home page component with optimized animations and sections
 */
export default function Home() {
  // Loading state for initial animation
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for sections
  const mainContentRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLHeadingElement>(null);
  const loaderLineRef = useRef<HTMLDivElement>(null);
  
  // Initialize GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Configure ScrollTrigger
    configureScrollTrigger();
    
    // Initial page load animation with GSAP
    const loadTimer = setTimeout(() => {
      if (loaderRef.current) {
        // Fade out loading screen
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsLoading(false);
            
            // Enable proper scrolling
            document.body.style.height = "auto";
            document.body.style.overflow = "visible";
            document.documentElement.style.overflow = "visible";
            document.documentElement.style.height = "auto";
            
            // Refresh ScrollTrigger to account for new content
            refreshScrollTrigger();
          }
        });
      }
    }, 700);
    
    return () => {
      clearTimeout(loadTimer);
      cleanupScrollTrigger();
    };
  }, []);
  
  // Loader animations
  useEffect(() => {
    if (isLoading && loaderTextRef.current && loaderLineRef.current) {
      // Loading screen animations
      gsap.fromTo(
        loaderTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
      );
      
      gsap.fromTo(
        loaderLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, delay: 0.4 }
      );
    }
  }, [isLoading]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      cleanupScrollTrigger();
    };
  }, []);
  
  return (
    <>
      <SkipToContent />
      {isLoading ? (
        <div 
          ref={loaderRef}
          className="fixed inset-0 bg-ethos-dark flex items-center justify-center z-50"
        >
          <div className="text-center">
            <h1 
              ref={loaderTextRef}
              className="text-3xl font-serif mb-4 opacity-0"
            >
              ETHOS
            </h1>
            <div 
              ref={loaderLineRef}
              className="w-16 h-0.5 bg-white mx-auto transform origin-left scale-x-0"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Main content */}
          <div ref={mainContentRef} className="min-h-screen relative overflow-visible">
            <Navbar />
            <Hero videoSrc="/video/home_hero.webm" />
            <ManyOne />
            <Evolution />
          </div>
        </>
      )}
    </>
  );
}
