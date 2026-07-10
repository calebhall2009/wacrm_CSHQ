"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const images = [
  {
    src: "/clean-dashboard-whitelabel.png",
    alt: "Dashboard Principal",
  },
  {
    src: "/clean-automations-whitelabel.png",
    alt: "Automatizaciones",
  },
  {
    src: "/clean-inbox-whitelabel.png",
    alt: "Bandeja de Entrada Multicanal",
  },
];

export function DashboardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    setActiveIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative w-full group">
      {/* Container */}
      <div className="rounded-2xl border bg-background/50 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] relative ring-1 ring-white/10">
        
        {/* Decorative top bar for mockup */}
        <div className="absolute top-0 left-0 w-full h-12 bg-muted/80 border-b flex items-center px-4 gap-2 z-20">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
          
          <div className="ml-auto text-xs font-medium text-muted-foreground bg-background/50 px-3 py-1 rounded-md transition-all">
            {images[activeIndex].alt}
          </div>
        </div>
        
        {/* Slider Track */}
        <div 
          className="flex w-full h-full pt-12 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="absolute inset-0 w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={goPrev}
        disabled={activeIndex === 0}
        className={cn(
          "absolute left-2 sm:-left-6 md:-left-12 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all z-50 cursor-pointer",
          activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-110"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur border shadow-lg flex items-center justify-center text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </div>
      </button>

      <button
        type="button"
        onClick={goNext}
        disabled={activeIndex === images.length - 1}
        className={cn(
          "absolute right-2 sm:-right-6 md:-right-12 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all z-50 cursor-pointer",
          activeIndex === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-110"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur border shadow-lg flex items-center justify-center text-foreground">
          <ChevronRight className="w-6 h-6" />
        </div>
        <span className="hidden md:block text-sm font-medium text-primary animate-bounce">Ver más</span>
      </button>

      {/* Dots Navigation */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all cursor-pointer",
              activeIndex === index ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
