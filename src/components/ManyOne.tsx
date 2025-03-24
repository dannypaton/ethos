import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from './ManyOne.module.css';

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ManyOne = () => {
  // Text layout as individual letters in the right order
  const textLayout = [
    ['O', 'U', 'T', '&nbsp;', 'O', 'F'],
    ['M', 'A', 'N', 'Y', ','],
    ['O', 'N', 'E']
  ];
  
  // Calculate total number of letters for refs array
  const totalLetters = textLayout.flat().length;
  
  // Element references
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const frameSequenceRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);
  const rippleEffectRef = useRef<HTMLDivElement>(null);
  // Add refs for each letter
  const letterRefs = useRef<(HTMLSpanElement | null)[]>(Array(totalLetters).fill(null));

  // State for animation
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 44; // Face00.webp to Face43.webp

  useEffect(() => {
    // Initialize elements
    const elementsToFade = [headingRef, textRef, lineRef];
    elementsToFade.forEach(ref => {
      if (ref.current) gsap.set(ref.current, { opacity: 1 });
    });

    // Set initial state for letter animations
    letterRefs.current.forEach((letter, index) => {
      if (letter) {
        // Different offset ranges based on which line the letter is on
        let baseOffset = -500;
        // Determine which row this letter belongs to
        let rowIndex = 0;
        if (index < 6) rowIndex = 0; // first row (OUT OF)
        else if (index < 11) rowIndex = 1; // second row (MANY,)
        else rowIndex = 2; // third row (ONE)
        
        baseOffset = -600 + (rowIndex * 100); // Higher offset for first row, less for each subsequent row
        
        // Create varied starting positions
        const randomOffset = Math.floor(Math.random() * 100) - 50; // Random value between -50 and 50
        gsap.set(letter, { 
          y: baseOffset + randomOffset, // Varied starting position
          opacity: 0,
          rotation: Math.random() * 6 - 3, // Slight random rotation between -3 and 3 degrees
        });
      }
    });

    // ScrollTrigger refresh handler for modals
    const handleModalStateChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
        const faceFramesTrigger = ScrollTrigger.getById("face-frames-animation");
        if (faceFramesTrigger) faceFramesTrigger.refresh();
      }, 300);
    };

    // Face frame animation ScrollTrigger
    if (sectionRef.current && frameSequenceRef.current) {
      // Create a randomized order array for letter animations once on mount
      const randomOrderIndices = [...Array(letterRefs.current.length).keys()];
      // Shuffle the array using Fisher-Yates algorithm
      for (let i = randomOrderIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomOrderIndices[i], randomOrderIndices[j]] = [randomOrderIndices[j], randomOrderIndices[i]];
      }

      // Find the container-custom div
      const containerElement = sectionRef.current.querySelector('.container-custom');
      
      // Find the image container as a more focused trigger point
      const imageContainer = frameSequenceRef.current?.closest('.relative');
      
      // Find the text overlay container with the letters
      const textOverlay = svgOverlayRef.current;

      // Create separate ScrollTrigger for face frames animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        end: "bottom 10%",
        scrub: true,
        onUpdate: (self) => {
          // Update frame based on scroll progress
          const progress = self.progress;
          const frameIndex = Math.min(
            totalFrames - 1,
            Math.max(0, Math.floor(progress * totalFrames))
          );
          setCurrentFrame(frameIndex);

          // Update ripple effect
          if (rippleEffectRef.current) {
            rippleEffectRef.current.style.setProperty(
              "--ripple-strength",
              (0.2 + progress * 0.1).toString()
            );
            rippleEffectRef.current.style.setProperty(
              "--ripple-speed",
              (2 - progress).toString() + "s"
            );
          }
        },
        id: "face-frames-animation",
        invalidateOnRefresh: true,
      });
      
      // Create separate ScrollTrigger specifically for letter animations
      // This allows the letters to animate independently from the face frames
      ScrollTrigger.create({
        trigger: textOverlay || imageContainer || containerElement, // Target the text overlay specifically
        start: "top bottom", // Start as soon as the text enters the viewport
        end: "top 40%", // End when text reaches 40% from the top - much earlier
        scrub: 0.5,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Animate letters based on scroll progress
          randomOrderIndices.forEach((randomIndex, orderPosition) => {
            const letter = letterRefs.current[randomIndex];
            if (letter) {
              // Calculate the progress threshold at which this letter should appear
              // Ensure all letters are visible by 90% of the scroll progress
              const appearThreshold = (orderPosition / letterRefs.current.length) * 0.9;
              
              // If scroll progress passes this letter's threshold, show it
              if (progress >= appearThreshold) {
                gsap.to(letter, {
                  y: 0,
                  opacity: 1,
                  rotation: 0,
                  duration: 0.3, // Quick transition when threshold is passed
                  ease: "power2.out"
                });
              } else {
                // Keep letter hidden if scroll hasn't reached its threshold
                gsap.to(letter, {
                  y: -300 + (randomIndex % 3) * 100, // Varied starting positions
                  opacity: 0,
                  rotation: (randomIndex % 6) - 3, // Slight random rotation
                  duration: 0.2,
                  ease: "power2.in"
                });
              }
            }
          });
        },
        id: "letter-animations",
        invalidateOnRefresh: true,
      });

      // Reveal animations
      gsap.fromTo(
        headingRef.current,
        { y: 20, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
      );

      gsap.fromTo(
        textRef.current,
        { y: 20, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power1.out" }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0.5, opacity: 0.8 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power1.out" }
      );
    }

    // Event listeners
    document.addEventListener('modalStateChange', handleModalStateChange);

    // Cleanup
    return () => {
      const faceFramesTrigger = ScrollTrigger.getById("face-frames-animation");
      if (faceFramesTrigger) {
        faceFramesTrigger.kill();
      } else {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      document.removeEventListener('modalStateChange', handleModalStateChange);
    };
  }, []);

  // Helper to get current frame image path
  const getFrameSrc = (index: number) => {
    const frameNum = index.toString().padStart(2, "0");
    return `/images/face_frames/Face${frameNum}.webp`;
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 lg:mt-[150px] relative bg-ethos-dark overflow-visible"
    >
      <div className="container-custom">
        {/* Main content container */}
        <div className="relative mx-20px">
          {/* SVG Text Overlay */}
          <div
            ref={svgOverlayRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="flex flex-col items-center justify-center absolute inset-0">
              <h1 className="text-[70px] md:text-[110px] lg:text-[280px] text-white text-center z-50 leading-[210px] top-[-50px] relative">
                {textLayout.map((row, rowIndex) => (
                  <div 
                    key={`row-${rowIndex}`} 
                    className={`flex justify-center ${rowIndex < textLayout.length - 1 ? 'mb-4 md:mb-8' : ''}`}
                  >
                    {row.map((letter, letterIndex) => {
                      const globalIndex = rowIndex === 0 
                        ? letterIndex 
                        : rowIndex === 1 
                          ? letterIndex + textLayout[0].length 
                          : letterIndex + textLayout[0].length + textLayout[1].length;
                      
                      return (
                        <span
                          key={`letter-${rowIndex}-${letterIndex}`}
                          ref={(el) => { letterRefs.current[globalIndex] = el; }}
                          className={`inline-block transform-gpu ${
                            letter === ',' || letter === '&nbsp;' ? 'mr-[0.1em] relative -translate-y-[0.3em]' : 
                            letter === '&nbsp;' ? 'mx-[0.2em]' : 'mx-[0.02em] md:mx-[0.04em]'
                          }`}
                          style={{ opacity: 0, transform: 'translateY(-300px)' }}
                        >
                          {letter === '&nbsp;' ? '\u00A0' : letter}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </h1>
            </div>
          </div>

          {/* Image content */}
          <div className="flex flex-col items-center">
            <div
              ref={imageRef}
              className="w-[200px] h-[250px] md:w-[405px] md:h-[505px] relative md:mb-12 md:mb-0 z-10"
            >
              <div className="relative h-full w-full overflow-hidden">
                {/* Animated frame sequence */}
                <div
                  ref={frameSequenceRef}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={getFrameSrc(currentFrame)}
                    alt="Face sequence animation"
                    fill
                    className="object-cover"
                    unoptimized={false}
                    priority
                  />

                  {/* Visual effects layer group */}
                  <div className="absolute inset-0 w-full h-full">
                    {/* Ripple effect */}
                    <div
                      ref={rippleEffectRef}
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0) 100%)",
                        backgroundSize: "200% 100%",
                        animation: `${styles.rippleEffect} var(--ripple-speed, 2s) infinite linear`,
                        opacity: 0.9,
                        mixBlendMode: "overlay",
                        ["--ripple-strength" as string]: "0.2",
                        ["--ripple-speed" as string]: "2s",
                      }}
                    />

                    {/* Vertical line effect */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background: "repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.07) 15px, rgba(255,255,255,0.04) 16px)",
                      }}
                    />

                    {/* Distortion effect */}
                    <div
                      className="absolute inset-0 w-full h-full opacity-30"
                      style={{
                        background: "repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.03) 30px, transparent 31px)",
                        backgroundSize: "100px 100%",
                        animation: `${styles.distortionShift} 3s infinite ease-in-out alternate`,
                      }}
                    />
                  </div>
                </div>

                {/* Decorative border */}
                <div
                  ref={decorRef}
                  className="absolute inset-0 border-2 border-ethos-gray/20 -translate-x-2 -translate-y-2 pointer-events-none z-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="flex flex-col justify-center mt-20 md:mt-60 m-auto w-[200px] md:w-full">
        <p
          ref={textRef}
          className="text-[24px] md:text-[50px] text-white mb-6 opacity-100 text-center owners"
        >
          ONE RESIDENCE. ONE LIFE. ONE ETHOS.
        </p>
      </div>
    </section>
  );
};

export default ManyOne;
