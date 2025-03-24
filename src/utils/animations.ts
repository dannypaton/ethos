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

/**
 * Create a fade-in animation for multiple elements
 */
export const createFadeInAnimation = (
  elements: Element | Element[] | NodeListOf<Element>,
  options?: {
    trigger?: Element;
    start?: string;
    end?: string;
    delay?: number;
    stagger?: number;
    y?: number;
    duration?: number;
    ease?: string;
    once?: boolean;
  }
) => {
  const {
    trigger,
    start = 'top 80%',
    end = 'bottom bottom',
    delay = 0,
    stagger = 0.15,
    y = 30,
    duration = 0.7,
    ease = 'power3.out',
    once = true,
  } = options || {};

  // Create timeline if trigger is provided
  if (trigger) {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions: 'play none none reverse',
        once,
      }
    });

    return timeline.from(elements, {
      y,
      opacity: 0,
      duration,
      stagger,
      delay,
      ease,
    });
  }

  // Simple animation without ScrollTrigger
  return gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease,
  });
};

/**
 * Add hover animation to elements
 */
export const addHoverAnimation = (
  elements: Element | Element[] | NodeListOf<Element>,
  options?: {
    scale?: number;
    duration?: number;
    ease?: string;
  }
) => {
  const {
    scale = 1.05,
    duration = 0.3,
    ease = 'power2.out',
  } = options || {};

  const elementsArray = Array.isArray(elements) || elements instanceof NodeList
    ? Array.from(elements)
    : [elements];

  elementsArray.forEach(element => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale,
        duration,
        ease,
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease,
      });
    });
  });
};

/**
 * Create a section transition animation
 */
export const createSectionTransitionAnimation = (
  transitionLine: Element,
  sections: Element | Element[] | NodeListOf<Element>
) => {
  const sectionsArray = Array.isArray(sections) || sections instanceof NodeList
    ? Array.from(sections)
    : [sections];

  sectionsArray.forEach((section, index) => {
    if (index === 0) return; // Skip first section

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom bottom',
      onEnter: () => {
        gsap.fromTo(transitionLine,
          { height: 0, top: 0 },
          {
            height: '100%',
            top: 0,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              gsap.to(transitionLine, {
                height: 0,
                top: '100%',
                duration: 0.5,
                delay: 0.2,
                ease: 'power2.in'
              });
            }
          }
        );
      },
      once: true
    });
  });
};

/**
 * Initialize the hero animations
 */
export const initHeroAnimations = (
  titleRef: React.RefObject<HTMLElement>,
  subtitleRef: React.RefObject<HTMLElement>,
  videoButtonRef: React.RefObject<HTMLElement>
) => {
  gsap.set([titleRef.current, subtitleRef.current, videoButtonRef.current], {
    opacity: 0
  });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

  tl.to(titleRef.current, {
    opacity: 1,
    y: 0,
    delay: 0.5
  })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0
    }, '-=0.8')
    .to(videoButtonRef.current, {
      opacity: 1,
      scale: 1
    }, '-=0.6');

  return tl;
};

/**
 * Initialize scroll animations for sections
 */
export const initScrollAnimations = (
  sectionRef: React.RefObject<HTMLElement>,
  elements: Array<{
    ref: React.RefObject<HTMLElement>,
    animation: gsap.TweenVars
  }>
) => {
  elements.forEach(({ ref, animation }) => {
    gsap.from(ref.current, {
      ...animation,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      }
    });
  });
};

/**
 * Text reveal animation helper
 */
export const textRevealAnimation = (
  element: HTMLElement,
  options: {
    delay?: number,
    direction?: 'up' | 'down' | 'left' | 'right',
    duration?: number
  } = {}
) => {
  const { delay = 0, direction = 'up', duration = 1 } = options;

  const directionMap = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  };

  const directionProps = directionMap[direction];

  gsap.from(element, {
    opacity: 0,
    ...directionProps,
    duration,
    delay,
    ease: 'power3.out'
  });
};

/**
 * Image reveal animation helper
 */
export const imageRevealAnimation = (
  element: HTMLElement,
  options: {
    delay?: number,
    duration?: number
  } = {}
) => {
  const { delay = 0, duration = 1.2 } = options;

  // Create a mask overlay
  const parent = element.parentElement;
  const mask = document.createElement('div');
  mask.style.position = 'absolute';
  mask.style.top = '0';
  mask.style.left = '0';
  mask.style.right = '0';
  mask.style.bottom = '0';
  mask.style.backgroundColor = '#031220';
  mask.style.zIndex = '1';

  if (parent) {
    parent.style.position = 'relative';
    parent.appendChild(mask);
  }

  // Reveal animation
  gsap.to(mask, {
    scaleX: 0,
    transformOrigin: 'left',
    duration,
    delay,
    ease: 'power3.inOut',
    onComplete: () => {
      if (parent) {
        parent.removeChild(mask);
      }
    }
  });

  // Optional scale animation on the image itself
  gsap.from(element, {
    scale: 1.1,
    duration: duration * 1.2,
    delay,
    ease: 'power3.out'
  });
}; 