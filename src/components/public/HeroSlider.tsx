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
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";

export interface HeroSlide {
  id: string;
  badge: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
  accentGradient: string;
  metrics: { label: string; value: string; unit?: string }[];
  tag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "infrastructure",
    tag: "Enterprise Infrastructure",
    badge: "Harar & Dire Dawa • Certified IT Hubs",
    headline: "Building Reliable Technology Infrastructure for",
    headlineHighlight: "Eastern Ethiopia.",
    description:
      "Enterprise server rack installations, certified Cat6 structured cabling, and resilient IT architectures engineered for continuous commercial uptime.",
    primaryCta: {
      label: "Explore Infrastructure Services",
      href: "/services",
    },
    secondaryCta: {
      label: "Request Site Survey",
      href: "/contact",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Enterprise server room and high-capacity network rack infrastructure",
    accentGradient: "from-blue-400 via-sky-300 to-indigo-300",
    metrics: [
      { label: "Regional Hubs", value: "2", unit: "Hubs" },
      { label: "Backbone", value: "10", unit: "Gbps" },
      { label: "SLA Response", value: "<2", unit: "hrs" },
    ],
  },
  {
    id: "pos-hardware",
    tag: "Retail Automation",
    badge: "Commercial POS Hardware & Spares",
    headline: "Smart Retail Technology and",
    headlineHighlight: "Commercial Solutions.",
    description:
      "Heavy-duty capacitive touch terminals, 80mm thermal receipt printers, and offline-first software that keeps ringing sales even during telecom blackouts.",
    primaryCta: {
      label: "Browse POS Hardware",
      href: "/products",
    },
    secondaryCta: {
      label: "Get Equipment Quote",
      href: "/contact?category=HARDWARE_EQUIPMENT",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Commercial POS touch terminal and retail automation hardware",
    accentGradient: "from-amber-400 via-orange-300 to-yellow-200",
    metrics: [
      { label: "Print Speed", value: "<1.2", unit: "s" },
      { label: "Offline Resilience", value: "100", unit: "%" },
      { label: "Local Spares", value: "Ready", unit: "" },
    ],
  },
  {
    id: "network-security",
    tag: "Commercial Networking",
    badge: "Carrier-Grade Cat6 & Dual-WAN LAN",
    headline: "Secure, Connected, and Reliable",
    headlineHighlight: "Digital Infrastructure.",
    description:
      "Turnkey multi-floor structured cabling, MikroTik core routing, and high-density commercial Wi-Fi with automatic 1.5s fiber & 4G failover.",
    primaryCta: {
      label: "Inspect Networking Solutions",
      href: "/services#networking",
    },
    secondaryCta: {
      label: "Book LAN Assessment",
      href: "/contact?category=NETWORKING_INFRASTRUCTURE",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Cat6 structured cabling and enterprise network switches",
    accentGradient: "from-emerald-400 via-teal-300 to-cyan-200",
    metrics: [
      { label: "AP Capacity", value: "150+", unit: "devs" },
      { label: "Auto Failover", value: "1.5", unit: "s" },
      { label: "VLAN Isolation", value: "4", unit: "nets" },
    ],
  },
  {
    id: "enterprise-support",
    tag: "Emergency SLA Support",
    badge: "Contractual On-Site SLA Response",
    headline: "Technology Solutions Designed for",
    headlineHighlight: "Business Growth.",
    description:
      "Eliminate unpredictable downtime with guaranteed <2-hour emergency on-site dispatch, monthly de-dusting, and automated encrypted backups in Harar and Dire Dawa.",
    primaryCta: {
      label: "Explore SLA Maintenance",
      href: "/services#maintenance",
    },
    secondaryCta: {
      label: "Emergency SLA Dispatch",
      href: "/contact?category=IT_MAINTENANCE_SUPPORT",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Field technician maintaining enterprise IT equipment",
    accentGradient: "from-sky-400 via-blue-300 to-indigo-200",
    metrics: [
      { label: "Emergency SLA", value: "<2", unit: "hrs" },
      { label: "System Uptime", value: "99.9", unit: "%" },
      { label: "Local Hubs", value: "2", unit: "cities" },
    ],
  },
];

const SLIDE_DURATION_MS = 3800; // Fast and dynamic 3.8s slide transition

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch gesture support for mobile
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      goToNext(); // Swipe left
    } else if (distance < -40) {
      goToPrev(); // Swipe right
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Autoplay loop with smooth progress increment
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = 40;
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
  }, [isPlaying, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 text-white select-none group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Ariiti Tech Motion Slider Banner"
    >
      {/* 1. Horizontal Motion Slider Track */}
      <div
        className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="w-full min-w-full shrink-0 relative px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16 min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex flex-col justify-between"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                priority={idx === 0}
                className="object-cover object-center scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
              />
              {/* Cinematic Dark Overlays for Extreme Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
              <div
                className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
                aria-hidden="true"
              />
            </div>

            {/* Slide Foreground Content */}
            <div className="relative z-10 max-w-3xl text-left my-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-bold tracking-wider uppercase mb-3.5 backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{slide.badge}</span>
              </div>

              {/* Main Headline with Motion Typography */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14]">
                {slide.headline}{" "}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentGradient}`}
                >
                  {slide.headlineHighlight}
                </span>
              </h1>

              {/* Description */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={slide.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-ariiti-navy font-bold text-xs sm:text-sm shadow-xl shadow-white/10 hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.98] transition-all duration-150"
                >
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ariiti-accent shrink-0" />
                </Link>
                <Link
                  href={slide.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all duration-150"
                >
                  <span>{slide.secondaryCta.label}</span>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6">
                {slide.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-baseline gap-1 text-left">
                    <span className="text-lg sm:text-xl font-black text-white font-mono">
                      {m.value}
                    </span>
                    {m.unit && (
                      <span className="text-xs text-blue-400 font-bold font-mono">
                        {m.unit}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Top Linear Motion Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-slate-900/80 z-20">
        <div
          className="h-full bg-gradient-to-r from-ariiti-accent to-blue-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 3. Floating Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white backdrop-blur-md transition-all duration-150 opacity-80 sm:opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white backdrop-blur-md transition-all duration-150 opacity-80 sm:opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* 4. Bottom Controls Strip: Pill Indicators & Pause/Play */}
      <div className="absolute bottom-4 inset-x-0 px-4 sm:px-10 flex items-center justify-between z-20 pointer-events-none">
        {/* Clickable Motion Dots / Pills */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 ${
                  isActive
                    ? "w-7 sm:w-9 bg-white shadow-md shadow-white/20"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Jump to slide ${idx + 1}: ${slide.tag}`}
              />
            );
          })}
        </div>

        {/* Counter & Play/Pause */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-slate-300 backdrop-blur-md pointer-events-auto">
          <span>0{currentIndex + 1} / 0{totalSlides}</span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-0.5 text-slate-400 hover:text-white transition-colors"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-amber-400" />
            ) : (
              <Play className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
