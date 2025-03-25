import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./Evolution.module.css";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Evolution = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enhanced button animation with reduced motion check
  const handleButtonHover = useCallback(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && buttonRef.current) {
      const spanElement = buttonRef.current.querySelector("span");
      const imgElement = buttonRef.current.querySelector("img");

      if (spanElement) {
        gsap.to(spanElement, {
          x: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (imgElement) {
        gsap.to(imgElement, {
          x: 3,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      buttonRef.current.classList.add(styles.isHovered);
    }
  }, []);

  const handleButtonLeave = useCallback(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && buttonRef.current) {
      const spanElement = buttonRef.current.querySelector("span");
      const imgElement = buttonRef.current.querySelector("img");

      if (spanElement) {
        gsap.to(spanElement, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (imgElement) {
        gsap.to(imgElement, {
          x: 0,
          opacity: 0.7,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      buttonRef.current.classList.remove(styles.isHovered);
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Make sure elements are visible first
    [titleRef, lineRef, paragraphRef, buttonRef].forEach(ref => {
      if (ref.current) gsap.set(ref.current, { opacity: 1 });
    });

    if (!prefersReducedMotion && sectionRef.current) {
      // Simple fade in for image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0.8 },
          { opacity: 1, duration: 1.2, delay: 0.2 }
        );

        const img = imageRef.current.querySelector("img");
        if (img) {
          gsap.from(img, {
            scale: 1.1,
            duration: 1.6,
            ease: "power2.out",
          });
        }
      }

      // Simple animations that start from visible
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0.5, opacity: 0.8 },
        { scaleX: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: "power1.out" }
      );

      gsap.fromTo(
        paragraphRef.current,
        { y: 10, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power1.out" }
      );

      gsap.fromTo(
        buttonRef.current,
        { y: 10, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power1.out" }
      );
    }

    // Handle body overflow when modal is open
    document.body.style.overflow = isModalOpen ? "hidden" : "";

    return () => {
      // Cleanup
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Modal open/close functions
  const openModal = useCallback(() => {
    setIsModalOpen(true);

    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }

    // Prevent background scrolling but don't affect ScrollTrigger
    document.body.style.overflow = "hidden";

    // Don't disable ScrollTrigger updates when modal is open
    ScrollTrigger.update();

    // Dispatch custom event for other components to respond
    document.dispatchEvent(
      new CustomEvent("modalStateChange", { detail: { isOpen: true } })
    );
  }, []);

  const closeModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsModalOpen(false);
          document.body.style.overflow = "";
          ScrollTrigger.update();

          setTimeout(() => {
            ScrollTrigger.refresh();
            document.dispatchEvent(
              new CustomEvent("modalStateChange", { detail: { isOpen: false } })
            );
          }, 100);
        },
      });
    }
  }, []);

  // Handle keyboard events for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal(e as unknown as React.MouseEvent);
    }
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section
      ref={sectionRef}
      className="py-0 bg-ethos-dark relative max-w-[1240px] mx-auto mb-48"
      aria-label="Evolution Section"
    >
      <div className="container-custom mx-0 px-0 max-w-none flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="w-full lg:w-8/12" ref={imageContainerRef}>
          <div
            ref={imageRef}
            className="w-full h-full overflow-hidden opacity-100"
          >
            <Image
              src="/images/home-1.webp"
              alt="Aerial view of Metrotown's urban landscape"
              fill
              priority
              className="transform transition-transform duration-700 !relative px-[10%] lg:px-0 object-cover object-position-center"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div
          ref={textRef}
          className="w-full lg:w-4/12 flex flex-col md:pl-16 lg:pt-16 p-[6%]"
        >
          <div>
            <h2
              ref={titleRef}
              className="text-[32px] md:text-[50px] font-cirka mb-8 text-white leading-tight tracking-wide"
            >
              ANTHEM&apos;S
              <br />
              METROTOWN
              <br />
              <span className="relative">EVOLUTION</span>
            </h2>

            <div 
              ref={lineRef} 
              className="w-16 h-0.5 bg-white mb-24"
              aria-hidden="true"
            ></div>

            <p
              ref={paragraphRef}
              className="font-owners-light text-white mb-16 text-base md:text-[18px] leading-relaxed"
            >
              Two decades of Metrotown placemaking. A trusted partner in a
              city&apos;s dramatic growth. Our unwavering ethos for meaningful
              change.
            </p>

            <div className={styles.anthemBtnContainer}>
              <button
                className={styles.anthemBtn}
                ref={buttonRef}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={openModal}
                aria-label="Learn more about Anthem's Metrotown Evolution"
                aria-expanded={isModalOpen}
                aria-controls="evolution-modal"
              >
                <span className="relative inline-flex items-center">
                  ANTHEM
                  <Image
                    src="/images/button-arrow.svg"
                    alt=""
                    width={20}
                    height={10}
                    className="ml-3 opacity-70 transition-all duration-300"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          ref={modalRef}
          id="evolution-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-6"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-ethos-gray transition-colors p-2"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <Image
                src="/images/icon-close.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            </button>

            <div className="relative aspect-video overflow-hidden">
              <Image
                src="/images/home-1.webp"
                alt="Detailed aerial view of Metrotown's urban development"
                fill
                style={{ objectFit: "cover" }}
                className="w-full"
                priority
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-transparent to-black/90">
                <h3 
                  id="modal-title"
                  className="text-lg md:text-xl font-cirka mb-2"
                >
                  ANTHEM&apos;S METROTOWN EVOLUTION
                </h3>
                <p className="text-sm font-owners-light text-white/70">
                  An aerial view of Metrotown&apos;s urban landscape, showcasing
                  Anthem&apos;s development impact over two decades.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Evolution;
