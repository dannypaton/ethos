import { useState, useEffect, useRef } from 'react';

interface InViewOptions {
  /**
   * Margin around the root element
   * @default "0px"
   */
  rootMargin?: string;
  
  /**
   * Threshold(s) at which the callback should be executed
   * @default 0.1
   */
  threshold?: number | number[];
  
  /**
   * Whether to trigger once or repeatedly
   * @default true
   */
  triggerOnce?: boolean;
}

/**
 * Custom hook that detects when an element is in the viewport
 * Useful for triggering animations or lazy loading
 * 
 * @param options Configuration options for the IntersectionObserver
 * @returns An object with the ref to attach and whether the element is in view
 */
export const useInView = (options: InViewOptions = {}) => {
  const {
    rootMargin = "0px",
    threshold = 0.1,
    triggerOnce = true
  } = options;
  
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    
    if (!element || (isInView && triggerOnce)) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          if (triggerOnce && observer && element) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );
    
    observer.observe(element);
    
    return () => {
      if (element && observer) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, triggerOnce, isInView]);
  
  return [ref, isInView];
};

export default useInView; 