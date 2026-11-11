import React from "react";
import HeroSlider from "./HeroSlider";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-ariiti-light pt-2 pb-6 sm:pt-4 sm:pb-8 border-b border-slate-200/60">
      {/* Background tech grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#20305C_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Dynamic Motion Slider Banner */}
        <HeroSlider />
      </div>
    </section>
  );
};

export default HeroSection;
