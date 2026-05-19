"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionIntro from "./SectionIntro";

const testimonials = [
  { name: "Ayesha & Usman", role: "Wedding, March 2026", text: "EventPro handled our entire wedding week — mehndi, baraat, and walima. Every detail was flawless. Our families are still talking about the decor and catering.", rating: 5 },
  { name: "Fatima Khan", role: "Corporate Gala, Jan 2026", text: "We entrusted our annual corporate dinner to EventPro and they delivered beyond expectations. The coordination, setup, and professionalism were world-class.", rating: 5 },
  { name: "Ahmed & Zara", role: "Nikkah Reception, Feb 2026", text: "From venue selection to the final plate, everything was seamless. The team was always available and handled all our family's requests with grace.", rating: 5 },
  { name: "Sara Malik", role: "Birthday Celebration, Dec 2025", text: "The birthday decor was absolutely stunning. Every guest asked who planned it. The attention to detail and personal touch made all the difference.", rating: 5 },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "fill-gold text-gold" : "text-white/30"} />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonialIndex, setTestimonialIndex, testimonialPaused, setTestimonialPaused }) {
  return (
    <section className="bg-[#fcf6ed] py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <SectionIntro eyebrow="Client Love" title="What our clients say" copy="Real feedback from the events we have had the privilege to plan and execute across Pakistan." />
        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="bg-card-bg border-[4px] border-border p-8 md:p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <StarRating rating={testimonials[testimonialIndex].rating} />
              <p className="mt-5 text-lg leading-8 italic text-foreground/85">&ldquo;{testimonials[testimonialIndex].text}&rdquo;</p>
              <div className="mt-6">
                <div className="text-sm font-black text-foreground">{testimonials[testimonialIndex].name}</div>
                <div className="text-xs text-black/50 mt-0.5">{testimonials[testimonialIndex].role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex items-center justify-center gap-3">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === testimonialIndex ? "w-8 bg-accent" : "w-2.5 bg-[#c4b096]/50 hover:bg-border"
                }`} />
            ))}
            <button onClick={() => setTestimonialPaused((p) => !p)} aria-label={testimonialPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-[10px] font-black text-text-muted hover:border-gold transition-colors">
              {testimonialPaused ? "▶" : "⏸"}
            </button>
          </div>
          <button onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-white shadow-md hover:border-gold transition-colors">
             <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <button onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-white shadow-md hover:border-gold transition-colors">
             <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>
      </div>
    </section>
  );
}
