import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import Container from "./ui/Container";
import SocialLinks, { SocialLink } from "./ui/SocialLinks";
import useAnimations from "@/hooks/useAnimations";

/**
 * Main navigation component for the site
 */
const Navbar = () => {
  // State for tracking scroll position and menu open state
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Single ref for the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  // Animation variants
  const { staggerContainer, menuItem, fadeInUp, fadeInScale } = useAnimations();

  // Pre-load videos for smoother experience
  useEffect(() => {
    const preloadMainVideo = document.createElement("video");
    preloadMainVideo.src = "/video/home_hero.webm";
    preloadMainVideo.preload = "auto";
    preloadMainVideo.style.display = "none";
    document.body.appendChild(preloadMainVideo);

    return () => {
      if (document.body.contains(preloadMainVideo)) {
        document.body.removeChild(preloadMainVideo);
      }
    };
  }, []);

  // Handle scroll events for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle video playback and body scrolling when menu opens/closes
  useEffect(() => {
    if (menuOpen) {
      // Start video when menu opens
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .catch((err) => console.error("Error playing video:", err));
      }

      // Prevent body scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "";
    }

    // Handle keyboard navigation - close menu on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Social media links data
  const socialLinks: SocialLink[] = [
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "instagram", url: "https://instagram.com" },
  ];

  // Navigation items
  const navItems = ["anthem", "metrotown", "ethos", "residences", "floorplans"];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ethos-dark/90 backdrop-blur-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Main navbar content */}
      <Container className="flex items-center justify-between">
        {/* Logo - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
          <Link href="/">
            <Image
              src={
                scrolled
                  ? "/images/logo-ethos-collapsed.svg"
                  : "/images/logo-ethos-full.svg"
              }
              alt="Ethos"
              width={scrolled ? 80 : 120}
              height={scrolled ? 40 : 60}
              className="transition-all duration-300"
            />
          </Link>
        </div>

        {/* Register Button */}
        <div className="flex items-center ml-auto mr-6 underline hidden md:block font-cirka-light">
          <Button href="#" variant="text" size="nav">
            Register
          </Button>
        </div>

        {/* Menu button */}
        <Button
          variant="icon"
          onClick={() => setMenuOpen(!menuOpen)}
          ariaLabel={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-20 p-0"
          size="sm"
        >
          <Image
            src={menuOpen ? "/images/icon-close.svg" : "/images/icon-menu.svg"}
            alt={menuOpen ? "Close menu" : "Open menu"}
            width={44}
            height={25}
            priority
          />
        </Button>

        {/* Fullscreen menu overlay with animation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 w-screen h-screen flex flex-col z-10"
              aria-modal="true"
              role="dialog"
              aria-label="Main menu"
            >
              {/* Background video */}
              <div className="absolute inset-0 z-0 overflow-hidden h-screen">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover min-h-screen min-w-screen"
                >
                  <source src="/video/home_hero.webm" type="video/webm" />
                </video>

                {/* Video overlay with animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-ethos-dark/50 backdrop-blur-[2px] h-screen"
                />
              </div>

              {/* Clear video in triangle shape on left */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute z-5 w-[315px] h-[90%] left-[7%] top-[5%]"
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
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover min-h-screen"
                >
                  <source src="/video/home_hero.webm" type="video/webm" />
                </video>
              </motion.div>

              <Container className="h-full flex flex-col md:flex-row relative z-10">
                <div className="flex w-full h-full pt-[75px]">
                  <motion.nav
                    className="flex justify-right items-center h-full ml-[8%]"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <Image
                      src="/images/logo-ethos-full.svg"
                      alt="Ethos"
                      width={272}
                      height={94}
                      className="mr-[5%] hidden md:block"
                    />
                    <div className="flex items-end md:flex-row flex-col">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item}
                          variants={menuItem}
                          custom={index}
                        >
                          <Button
                            href={`/${item}`}
                            variant="text"
                            size="nav"
                            onClick={() => setMenuOpen(false)}
                            className="font-cirka-light relative group"
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                            <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-white transition-all duration-300 ease-out group-hover:w-[30%]" 
                                  style={{
                                    backgroundImage: "url('/images/active-underline.svg')",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    marginLeft: "16px"
                                  }}>
                            </span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.nav>
                </div>

                {/* Social Links with animation */}
                <motion.div
                  className="flex justify-end mb-8 mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <SocialLinks links={socialLinks} />
                </motion.div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

export default Navbar;
