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
  const svgRef = useRef<SVGSVGElement>(null);
  const rippleEffectRef = useRef<HTMLDivElement>(null);

  // State for animation
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 44; // Face00.webp to Face43.webp

  useEffect(() => {
    // Initialize elements
    const elementsToFade = [headingRef, textRef, lineRef];
    elementsToFade.forEach(ref => {
      if (ref.current) gsap.set(ref.current, { opacity: 1 });
    });

    // Set initial state for SVG paths
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path');
      paths.forEach((path) => {
        gsap.set(path, {
          opacity: 0,
          y: -300,
          rotation: Math.random() * 6 - 3,
        });
      });
    }

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
      // Find the container-custom div
      const containerElement = sectionRef.current.querySelector('.container-custom');
      
      // Find the image container as a more focused trigger point
      const imageContainer = frameSequenceRef.current?.closest('.relative');

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
      
      // Create separate ScrollTrigger for SVG path animations
      if (svgRef.current) {
        const paths = Array.from(svgRef.current.querySelectorAll('path'));
        const randomOrderPaths = [...paths].sort(() => Math.random() - 0.5);
        
        ScrollTrigger.create({
          trigger: imageContainer || containerElement,
          start: "top bottom",
          end: "top 40%",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            
            randomOrderPaths.forEach((path, index) => {
              const appearThreshold = (index / paths.length) * 0.9;
              
              if (progress >= appearThreshold) {
                gsap.to(path, {
                  y: 0,
                  opacity: 1,
                  rotation: 0,
                  duration: 0.3,
                  ease: "power2.out"
                });
              } else {
                gsap.to(path, {
                  y: -300,
                  opacity: 0,
                  rotation: (index % 6) - 3,
                  duration: 0.2,
                  ease: "power2.in"
                });
              }
            });
          },
          id: "svg-animations",
          invalidateOnRefresh: true,
        });
      }

      // Reveal animations with reduced motion preference check
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
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
    }

    // Event listeners
    document.addEventListener('modalStateChange', handleModalStateChange);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
      aria-label="Many One Section"
    >
      <div className="container-custom">
        {/* Main content container */}
        <div className="relative mx-20px">
          {/* SVG Text Overlay */}
          <div 
            className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-30 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              ref={svgRef}
              width="969"
              height="707"
              viewBox="0 0 969 707"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-[969px]"
              role="presentation"
            >
              <path d="M742.442 555.552L739.562 555.84C738.986 549.504 737.162 543.936 734.09 539.136C731.018 534.336 726.026 531.936 719.114 531.936H635.594V521.28H739.562L740.138 527.904L742.442 555.552ZM717.386 694.08C724.874 694.08 730.73 691.584 734.954 686.592C739.37 681.408 742.442 675.456 744.17 668.736L747.338 669.6L739.562 698.112L737.834 704.736H636.458V694.08H717.386ZM601.898 701.568C607.466 701.568 612.266 700.128 616.298 697.248C620.522 694.176 622.634 688.896 622.634 681.408V544.608C622.634 537.12 620.522 531.936 616.298 529.056C612.266 525.984 607.466 524.448 601.898 524.448V521.28H626.09H639.626V704.736H626.09H601.898V701.568ZM701.834 600.768C709.322 600.768 714.506 599.232 717.386 596.16C720.458 592.896 721.994 589.248 721.994 585.216H725.162V603.36V608.256V626.4H721.994C721.994 622.368 720.458 618.816 717.386 615.744C714.506 612.48 709.322 610.848 701.834 610.848H635.594V600.768H701.834Z" fill="#DAD9D6"/>
              <path d="M425.382 681.408C425.382 688.896 427.398 694.176 431.43 697.248C435.462 700.128 440.262 701.568 445.83 701.568V704.736H421.926H417.03H392.838V701.568C398.406 701.568 403.206 700.128 407.238 697.248C411.462 694.176 413.574 688.896 413.574 681.408V544.608C413.574 537.12 411.462 531.936 407.238 529.056C403.206 525.984 398.406 524.448 392.838 524.448V521.28H417.03H425.382V681.408ZM545.19 681.408C545.19 688.896 547.206 694.176 551.238 697.248C555.462 700.128 560.358 701.568 565.926 701.568V704.736H541.734H533.382V544.608C533.382 537.12 530.982 531.936 526.182 529.056C521.382 525.984 515.718 524.448 509.19 524.448V521.28H537.414H541.734H565.926V524.448C560.358 524.448 555.462 525.984 551.238 529.056C547.206 531.936 545.19 537.12 545.19 544.608V681.408ZM521.574 704.736L417.318 521.28H436.038L540.294 704.736H521.574Z" fill="#DAD9D6"/>
              <path d="M282.118 518.4C299.782 518.4 314.662 522.432 326.758 530.496C339.046 538.368 348.166 549.312 354.118 563.328C360.262 577.152 363.334 593.088 363.334 611.136C363.334 629.184 360.262 645.504 354.118 660.096C348.166 674.496 339.046 685.92 326.758 694.368C314.662 702.624 299.782 706.752 282.118 706.752C264.454 706.752 249.478 702.624 237.19 694.368C225.094 685.92 215.974 674.496 209.83 660.096C203.878 645.504 200.902 629.184 200.902 611.136C200.902 593.088 203.878 577.152 209.83 563.328C215.974 549.312 225.094 538.368 237.19 530.496C249.478 522.432 264.454 518.4 282.118 518.4ZM282.118 698.688C295.558 698.688 306.982 694.752 316.39 686.88C325.99 679.008 333.19 668.448 337.99 655.2C342.79 641.76 345.19 627.072 345.19 611.136C345.19 595.392 342.79 581.088 337.99 568.224C333.19 555.36 325.99 545.184 316.39 537.696C306.982 530.208 295.558 526.464 282.118 526.464C268.678 526.464 257.158 530.208 247.558 537.696C238.15 545.184 231.046 555.36 226.246 568.224C221.446 581.088 219.046 595.392 219.046 611.136C219.046 627.072 221.446 641.76 226.246 655.2C231.046 668.448 238.15 679.008 247.558 686.88C257.158 694.752 268.678 698.688 282.118 698.688Z" fill="#DAD9D6"/>
              <path d="M898.808 414.721L915.512 431.137L900.824 484.993H898.808V448.129L882.104 431.137L898.808 414.721Z" fill="#DAD9D6"/>
              <path d="M726.487 283.104C723.223 276.384 718.615 271.776 712.663 269.28C706.903 266.592 701.143 265.248 695.383 265.248V262.08H719.575H734.839L786.967 368.928H776.311L824.119 282.528C826.807 277.92 827.383 274.368 825.847 271.872C824.311 269.376 821.623 267.648 817.783 266.688C814.135 265.728 809.719 265.248 804.535 265.248V262.08H840.823H845.143H869.047V265.248C863.287 265.248 857.431 266.496 851.479 268.992C845.719 271.488 841.015 276 837.367 282.528L788.119 371.232V422.208C788.119 429.696 790.135 434.976 794.167 438.048C798.199 440.928 802.999 442.368 808.567 442.368V445.536H784.663H774.583H750.391V442.368C755.959 442.368 760.759 440.928 764.791 438.048C769.015 434.976 771.127 429.696 771.127 422.208V372.096L726.487 283.104Z" fill="#DAD9D6"/>
              <path d="M528.084 422.208C528.084 429.696 530.1 434.976 534.132 438.048C538.164 440.928 542.964 442.368 548.532 442.368V445.536H524.628H519.732H495.54V442.368C501.108 442.368 505.908 440.928 509.94 438.048C514.164 434.976 516.276 429.696 516.276 422.208V285.408C516.276 277.92 514.164 272.736 509.94 269.856C505.908 266.784 501.108 265.248 495.54 265.248V262.08H519.732H528.084V422.208ZM647.892 422.208C647.892 429.696 649.908 434.976 653.94 438.048C658.164 440.928 663.06 442.368 668.628 442.368V445.536H644.436H636.084V285.408C636.084 277.92 633.684 272.736 628.884 269.856C624.084 266.784 618.42 265.248 611.892 265.248V262.08H640.116H644.436H668.628V265.248C663.06 265.248 658.164 266.784 653.94 269.856C649.908 272.736 647.892 277.92 647.892 285.408V422.208ZM624.276 445.536L520.02 262.08H538.74L642.996 445.536H624.276Z" fill="#DAD9D6"/>
              <path d="M335.874 423.072C333.762 430.368 334.818 435.456 339.042 438.336C343.266 441.024 349.026 442.368 356.322 442.368V445.536H324.642H320.898H296.706V442.368C302.466 442.368 307.938 440.928 313.122 438.048C318.306 435.168 321.954 430.176 324.066 423.072L365.826 284.544C367.938 277.248 366.114 272.256 360.354 269.568C354.594 266.688 347.106 265.248 337.89 265.248V262.08H378.21H394.914L443.01 423.072C445.122 430.176 448.77 435.168 453.954 438.048C459.138 440.928 464.514 442.368 470.082 442.368V445.536H446.178H437.25H404.994V442.368C412.29 442.368 418.146 441.024 422.562 438.336C426.978 435.456 428.13 430.368 426.018 423.072L379.074 266.112H383.106L335.874 423.072ZM427.746 376.992V387.648H339.33V376.992H427.746Z" fill="#DAD9D6"/>
              <path d="M115.497 262.08L170.505 445.536H153.801L99.0811 262.08H115.497ZM45.2251 445.536V442.368C50.7931 442.368 55.8811 440.928 60.4891 438.048C65.2891 434.976 68.2651 429.696 69.4171 422.208L89.0011 285.408C90.1531 277.92 88.9051 272.736 85.2571 269.856C81.8011 266.784 77.2891 265.248 71.7211 265.248V262.08H95.9131H104.265L81.2251 422.208C80.0731 429.696 81.7051 434.976 86.1211 438.048C90.7291 440.928 96.4891 442.368 103.401 442.368V445.536H73.4491H69.4171H45.2251ZM167.337 445.536C166.953 443.616 166.761 442.176 166.761 441.216C166.185 435.84 166.089 430.08 166.473 423.936C167.049 417.6 168.489 410.88 170.793 403.776L213.129 262.08H224.649L170.793 445.536H167.337ZM221.769 445.536V442.368C228.105 442.368 233.385 440.928 237.609 438.048C242.025 434.976 243.657 429.696 242.505 422.208L219.465 262.08H232.137H256.329V265.248C250.761 265.248 246.153 266.784 242.505 269.856C239.049 272.736 237.897 277.92 239.049 285.408L258.633 422.208C259.785 429.696 262.665 434.976 267.273 438.048C272.073 440.928 277.257 442.368 282.825 442.368V445.536H258.633H249.993H221.769Z" fill="#DAD9D6"/>
              <path d="M827.921 183.169C833.489 183.169 838.289 181.729 842.321 178.849C846.545 175.777 848.657 170.497 848.657 163.009V26.2089C848.657 18.7209 846.545 13.5369 842.321 10.6569C838.289 7.58486 833.489 6.04886 827.921 6.04886V2.88086H852.113H865.649V163.009C865.649 170.497 867.665 175.777 871.697 178.849C875.729 181.729 880.529 183.169 886.097 183.169V186.337H862.193H852.113H827.921V183.169ZM966.161 9.50486L968.465 37.1529L965.585 37.4409C965.009 31.1049 963.185 25.5369 960.113 20.7369C957.041 15.9369 952.049 13.5369 945.137 13.5369H861.617V2.88086H965.585L966.161 9.50486ZM926.993 84.3849C934.481 84.3849 939.665 82.8489 942.545 79.7769C945.617 76.5129 947.153 72.8649 947.153 68.8329H950.321V86.9769V91.8729V110.017H947.153C947.153 105.985 945.617 102.433 942.545 99.3609C939.665 96.0969 934.481 94.4649 926.993 94.4649H860.753V84.3849H926.993Z" fill="#DAD9D6"/>
              <path d="M717.201 0C734.865 0 749.745 4.032 761.841 12.096C774.129 19.968 783.249 30.912 789.201 44.928C795.345 58.752 798.417 74.688 798.417 92.736C798.417 110.784 795.345 127.104 789.201 141.696C783.249 156.096 774.129 167.52 761.841 175.968C749.745 184.224 734.865 188.352 717.201 188.352C699.537 188.352 684.561 184.224 672.273 175.968C660.177 167.52 651.057 156.096 644.913 141.696C638.961 127.104 635.985 110.784 635.985 92.736C635.985 74.688 638.961 58.752 644.913 44.928C651.057 30.912 660.177 19.968 672.273 12.096C684.561 4.032 699.537 0 717.201 0ZM717.201 180.288C730.641 180.288 742.065 176.352 751.473 168.48C761.073 160.608 768.273 150.048 773.073 136.8C777.873 123.36 780.273 108.672 780.273 92.736C780.273 76.992 777.873 62.688 773.073 49.824C768.273 36.96 761.073 26.784 751.473 19.296C742.065 11.808 730.641 8.06401 717.201 8.06401C703.761 8.06401 692.241 11.808 682.641 19.296C673.233 26.784 666.129 36.96 661.329 49.824C656.529 62.688 654.129 76.992 654.129 92.736C654.129 108.672 656.529 123.36 661.329 136.8C666.129 150.048 673.233 160.608 682.641 168.48C692.241 176.352 703.761 180.288 717.201 180.288Z" fill="#DAD9D6"/>
              <path d="M460.501 163.008C460.501 170.496 462.517 175.776 466.549 178.848C470.581 181.728 475.381 183.168 480.949 183.168V186.336H457.045H446.965H422.773V183.168C428.341 183.168 433.141 181.728 437.173 178.848C441.397 175.776 443.509 170.496 443.509 163.008V2.88026H460.501V163.008ZM376.117 0.864258C378.229 1.63226 380.917 2.20826 384.181 2.59227C387.637 2.78427 391.957 2.88026 397.141 2.88026H506.869C512.053 2.88026 516.277 2.78427 519.541 2.59227C522.997 2.20826 525.781 1.63226 527.893 0.864258L528.757 9.21627L532.213 39.1683L529.045 39.7443C528.277 32.8323 526.069 26.7843 522.421 21.6003C518.965 16.2243 513.493 13.5363 506.005 13.5363H398.005C390.517 13.5363 384.949 16.1283 381.301 21.3123C377.845 26.4963 375.733 32.4483 374.965 39.1683L371.797 38.8803L375.253 9.21627L376.117 0.864258Z" fill="#DAD9D6"/>
              <path d="M243.79 2.59277V5.76076C238.222 5.76076 233.326 7.29677 229.102 10.3688C225.07 13.2488 223.054 18.4328 223.054 25.9208V116.065C223.054 136.033 226.99 151.681 234.862 163.009C242.734 174.145 254.734 179.713 270.862 179.713C286.99 179.713 298.99 174.145 306.862 163.009C314.734 151.681 318.67 136.033 318.67 116.065V26.2088C318.67 18.7208 316.654 13.5368 312.622 10.6568C308.59 7.58477 303.79 6.04876 298.222 6.04876V2.88077H322.126H327.022H351.214V6.04876C345.646 6.04876 340.75 7.58477 336.526 10.6568C332.494 13.5368 330.478 18.7208 330.478 26.2088V116.065C330.478 137.953 325.486 155.521 315.502 168.769C305.71 182.017 291.022 188.641 271.438 188.641C247.438 188.641 230.542 182.209 220.75 169.345C210.958 156.289 206.062 136.129 206.062 108.865V25.9208C206.062 18.4328 204.046 13.2488 200.014 10.3688C195.982 7.29677 191.182 5.76076 185.614 5.76076V2.59277H209.518H219.598H243.79Z" fill="#DAD9D6"/>
              <path d="M81.216 0C98.88 0 113.76 4.032 125.856 12.096C138.144 19.968 147.264 30.912 153.216 44.928C159.36 58.752 162.432 74.688 162.432 92.736C162.432 110.784 159.36 127.104 153.216 141.696C147.264 156.096 138.144 167.52 125.856 175.968C113.76 184.224 98.88 188.352 81.216 188.352C63.552 188.352 48.576 184.224 36.288 175.968C24.192 167.52 15.072 156.096 8.928 141.696C2.976 127.104 0 110.784 0 92.736C0 74.688 2.976 58.752 8.928 44.928C15.072 30.912 24.192 19.968 36.288 12.096C48.576 4.032 63.552 0 81.216 0ZM81.216 180.288C94.656 180.288 106.08 176.352 115.488 168.48C125.088 160.608 132.288 150.048 137.088 136.8C141.888 123.36 144.288 108.672 144.288 92.736C144.288 76.992 141.888 62.688 137.088 49.824C132.288 36.96 125.088 26.784 115.488 19.296C106.08 11.808 94.656 8.06401 81.216 8.06401C67.776 8.06401 56.256 11.808 46.656 19.296C37.248 26.784 30.144 36.96 25.344 49.824C20.544 62.688 18.144 76.992 18.144 92.736C18.144 108.672 20.544 123.36 25.344 136.8C30.144 150.048 37.248 160.608 46.656 168.48C56.256 176.352 67.776 180.288 81.216 180.288Z" fill="#DAD9D6"/>
            </svg>
          </div>

          {/* Image content */}
          <div className="flex flex-col items-center">
            <div
              ref={imageRef}
              className="w-[200px] h-[250px] md:w-[405px] md:h-[505px] relative md:mb-12 md:mb-0 z-10"
              aria-hidden="true"
            >
              <div className="relative h-full w-full overflow-hidden">
                {/* Animated frame sequence */}
                <div
                  ref={frameSequenceRef}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={getFrameSrc(currentFrame)}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={false}
                    priority
                    aria-hidden="true"
                  />

                  {/* Visual effects layer group */}
                  <div className="absolute inset-0 w-full h-full" aria-hidden="true">
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
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="flex flex-col justify-center mt-20 md:mt-60 m-auto w-[200px] md:w-full">
        <h2
          ref={textRef}
          className="text-[24px] md:text-[50px] text-white mb-6 opacity-100 text-center owners"
        >
          ONE RESIDENCE. ONE LIFE. ONE ETHOS.
        </h2>
      </div>
    </section>
  );
};

export default ManyOne;
