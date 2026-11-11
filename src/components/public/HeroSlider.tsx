"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  tag: string;
  heading: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  imageUrl: string;
  imageAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "software-solutions",
    tag: "Software & Digital Solutions",
    heading: "Building Digital Solutions for Growing Businesses",
    description:
      "We develop practical software and digital systems that help businesses work smarter, serve customers better and grow.",
    primaryCta: {
      label: "Explore Our Services",
      href: "/services",
    },
    secondaryCta: {
      label: "Contact Our Team",
      href: "/contact",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Professional software development and modern developer workspace",
  },
  {
    id: "networking-infrastructure",
    tag: "Networking & IT Infrastructure",
    heading: "Connecting Businesses Through Reliable Technology",
    description:
      "From network installation to IT infrastructure, we help businesses build reliable and connected working environments.",
    primaryCta: {
      label: "Discover Our Solutions",
      href: "/services#networking",
    },
    secondaryCta: {
      label: "Request a Consultation",
      href: "/contact",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Professional network infrastructure, routers, switches and structured cabling",
  },
  {
    id: "business-technology",
    tag: "Business Technology Solutions",
    heading: "Technology That Makes Business Easier",
    description:
      "We bring software, hardware and technical support together to simplify everyday business operations.",
    primaryCta: {
      label: "Talk to Our Team",
      href: "/contact",
    },
    secondaryCta: {
      label: "Explore Products",
      href: "/products",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Modern business environment using POS systems, computers and digital business tools",
  },
];

const SLIDE_DURATION_MS = 5500; // 5.5 seconds automatic transition

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsPlaying(false);
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsPlaying(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Automatic slide transition timer with progress bar
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / SLIDE_DURATION_MS) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focusing an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      goToNext(); // Swipe left -> next slide
    } else if (distance < -45) {
      goToPrev(); // Swipe right -> prev slide
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] flex items-center bg-[#093053]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Ariiti Tech Hero Background Image Slider"
    >
      {/* 1. Background Image Layers with Smooth Fade Transitions & Official Navy Overlay */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Official Brand Dark Navy Transparent Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(rgba(9, 48, 83, 0.78), rgba(9, 48, 83, 0.78))",
              }}
              aria-hidden="true"
            />
            {/* Subtle decorative dot grid for depth */}
            <div
              className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]"
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* 2. Top Linear Automatic Transition Indicator */}
      <div className="absolute top-0 inset-x-0 h-1 bg-white/15 z-30 pointer-events-none">
        <div
          className="h-full bg-white transition-all duration-75 ease-linear shadow-xs"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 3. Hero Slide Foreground Content (Consistently Positioned Across Slides) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl text-left">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className={cn(
                  "transition-opacity duration-700 ease-in-out",
                  isActive
                    ? "opacity-100 relative pointer-events-auto"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                )}
                aria-hidden={!isActive}
              >
                {/* Category Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-4 sm:mb-5 backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{slide.tag}</span>
                </div>

                {/* Primary Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  {slide.heading}
                </h1>

                {/* Supporting Description */}
                <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
                  {slide.description}
                </p>

                {/* Call to Action Buttons */}
                <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    href={slide.primaryCta.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-[#093053] font-bold text-sm sm:text-base shadow-lg hover:bg-slate-100 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#093053]"
                  >
                    <span>{slide.primaryCta.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#093053]" />
                  </Link>
                  {slide.secondaryCta && (
                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white hover:text-[#093053] border-2 border-white text-white font-bold text-sm sm:text-base backdrop-blur-md active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#093053]"
                    >
                      <span>{slide.secondaryCta.label}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Previous and Next Floating Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/25 hover:bg-white hover:text-[#093053] text-white backdrop-blur-md border border-white/20 transition-all duration-150 z-30 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/25 hover:bg-white hover:text-[#093053] text-white backdrop-blur-md border border-white/20 transition-all duration-150 z-30 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 5. Bottom Controls: Three Slide Pagination Dots, Counter & Play/Pause */}
      <div className="absolute bottom-5 sm:bottom-6 inset-x-0 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between z-30 pointer-events-none">
        {/* Three Slide Indicators / Pagination Dots */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  isActive
                    ? "w-8 sm:w-10 bg-white shadow-md shadow-white/40"
                    : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </div>

        {/* Slide Counter & Play/Pause Toggle */}
        <div className="flex items-center gap-2.5 bg-black/30 border border-white/20 px-3 py-1 rounded-full text-xs font-mono font-bold text-white backdrop-blur-md pointer-events-auto">
          <span>
            0{currentIndex + 1} / 0{totalSlides}
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-0.5 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
            aria-label={
              isPlaying ? "Pause automatic slide rotation" : "Play automatic slide rotation"
            }
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
