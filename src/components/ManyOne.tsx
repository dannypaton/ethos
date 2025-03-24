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

  // State for animation
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 44; // Face00.webp to Face43.webp

  useEffect(() => {
    // Initialize elements
    const elementsToFade = [headingRef, textRef, lineRef, svgOverlayRef];
    elementsToFade.forEach(ref => {
      if (ref.current) gsap.set(ref.current, { opacity: 1 });
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

      gsap.to(svgOverlayRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power1.out",
      });
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
      className="py-24 md:py-32 lg:py-40 relative bg-ethos-dark overflow-visible"
    >
      <div className="container-custom">
        {/* Main content container */}
        <div className="relative mx-20px">
          {/* SVG Text Overlay */}
          <div
            ref={svgOverlayRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-30 pointer-events-none"
          >
            <Image
              src="/images/outofmany-large.svg"
              alt="OUT OF MANY, ONE"
              width={900}
              height={500}
              className="z-50"
              priority
            />
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
                  <img
                    src={getFrameSrc(currentFrame)}
                    alt="Face sequence animation"
                    className="h-full w-full object-cover"
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
