import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Container from "./ui/Container";
import VideoBackground from "./ui/VideoBackground";
import Button from "./ui/Button";
import VideoModal from "./ui/VideoModal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  /**
   * URL of the background video
   */
  videoSrc?: string;

  /**
   * Alternative image to show before video loads
   */
  fallbackImage?: string;
}

/**
 * Hero section component with animated content and video background
 */
const Hero: React.FC<HeroProps> = ({
  videoSrc = "/video/home_hero.webm",
  fallbackImage = "/images/home-1.webp",
}) => {
  // State for video modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Refs for GSAP animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const triangleVideoRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const videoButtonRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations on component mount
  useEffect(() => {
    if (!sectionRef.current) return;

    // Center the triangular video element
    gsap.set(triangleVideoRef.current, {
      opacity: 0,
      scale: 0.95,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
    });

    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate the triangle video in
    tl.to(triangleVideoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: 0.4,
    });

    // Animate the logo and button
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6,
      }
    );

    // Initial entrance animation for video button
    gsap.fromTo(
      videoButtonRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.8,
      }
    );

    // Add scroll-triggered animation for video button
    gsap.fromTo(videoButtonRef.current,
      {
        opacity: 1,
        y: 0
      },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          toggleActions: "play reverse play reverse"
        },
        opacity: 0,
        y: -100,
        ease: "power1.inOut"
      }
    );

    // Clean up animations on unmount
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <header role="banner" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-visible">
      {/* Background video with optimization */}
      <VideoBackground
        src={videoSrc}
        fallbackImage={fallbackImage}
        blurAmount="sm"
        overlayOpacity={0.7}
        overlayClassName="backdrop-blur-sm"
        useLowPowerMode={true}
      />

      {/* Triangular video shape */}
      <div
        ref={triangleVideoRef}
        className="absolute z-10 w-[212px] h-[567px] left-1/2 top-[40%]"
        style={{
          clipPath: "polygon(0px 0px, 100% 23%, 100% 100%, 0% 100%)",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      </div>

      {/* Hero content */}
      <Container className="relative z-10 text-center">
        <main className="flex flex-col items-center mt-[200px]">
          {/* Logo with fade-in animation */}
          <div ref={logoRef} className="mb-8">
            <Image
              src="/images/logo-ethos-full.svg"
              alt="Ethos Metrotown Logo"
              width={741}
              height={256}
              className="mx-auto"
              priority
            />
          </div>

          {/* Primary heading for SEO and accessibility */}
          <h1 className="text-4xl font-bold text-white mb-8">
            Ethos Metrotown - Luxury Residences
          </h1>

          {/* Video button */}
          <div
            ref={videoButtonRef}
            className="mt-40 flex flex-col items-center"
          >
            <Button
              onClick={() => setVideoModalOpen(true)}
              variant="icon"
              ariaLabel="Watch video about Ethos Metrotown"
            >
              <Image
                src="/images/icon-play.png"
                width={36}
                height={36}
                alt=""
                className="group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Button>
            <p className="mt-4 text-sm uppercase tracking-wider font-medium text-white">
              WATCH VIDEO
            </p>
          </div>
        </main>
      </Container>

      {/* Video Modal */}
      <VideoModal
        src={videoSrc}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </header>
  );
};

export default Hero;
