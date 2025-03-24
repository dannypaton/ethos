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
  fallbackImage = "/images/hero-fallback.jpg",
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

    // Clean up animations on unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-visible"
    >
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
        <div className="flex flex-col items-center mt-[200px]">
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

          {/* Hidden h1 for SEO while maintaining design */}
          <h1 className="sr-only">Ethos Metrotown - Luxury Residences</h1>

          {/* Video button */}
          <div
            ref={videoButtonRef}
            className="mt-40 flex flex-col items-center"
          >
            <Button
              onClick={() => setVideoModalOpen(true)}
              variant="icon"
              ariaLabel="Watch video"
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
        </div>
      </Container>

      {/* Video Modal */}
      <VideoModal
        src={videoSrc}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
