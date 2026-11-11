import React from "react";
import HeroSlider from "./HeroSlider";

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden bg-[#093053] border-b border-[#093053] text-white">
      <HeroSlider />
    </section>
  );
};

export default HeroSection;
