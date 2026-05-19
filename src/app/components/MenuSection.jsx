"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import CtaLink from "./CtaLink";

const MotionImage = motion(Image);

export default function MenuSection() {
  return (
    <section id="menu" className="bg-[#fcf6ed] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-accent"><Utensils size={16} />Menu & Catering</div>
          <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl text-foreground">Food that feels generous, organized, and deeply familiar.</h2>
          <p className="mt-5 text-base leading-7 text-black/62">Build Pakistani menus with buffet service, live BBQ, chaat stations, desserts, tea service, and one-dish aware planning for wedding events.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Biryani", "BBQ", "Karahi", "Live Chaat", "Desserts", "Tea Service"].map((item) => (
              <span key={item} className="border-[4px] border-border bg-card-bg px-4 py-2 text-sm font-bold transition-all duration-300 hover:bg-gold-light hover:border-gold hover:-translate-y-0.5 hover:shadow-md cursor-default">{item}</span>
            ))}
          </div>
          <div className="mt-8"><CtaLink href="/bookings?category=catering-services">Book Catering</CtaLink></div>
        </div>
        <MotionImage
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          src="/images/Food.png" alt="Pakistani wedding catering"
          width={512} height={280} sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-[440px] w-full object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
