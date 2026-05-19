"use client";

import { motion } from "framer-motion";
import { Flower2, Sparkles, Camera } from "lucide-react";
import SectionIntro from "./SectionIntro";

export default function DecorSection() {
  return (
    <section id="decor" className="mx-auto max-w-7xl px-4 py-20">
      <SectionIntro eyebrow="Decor & Atmosphere" title="Design the room guests remember" copy="Stage design, florals, lighting, furniture, signage, and entrances are planned together so the event has one clear visual language." />
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: <Flower2 size={22} />, title: "Florals & Stage", copy: "Mandap, sofa, backdrop, aisle, centerpieces, and family photo areas." },
          { icon: <Sparkles size={22} />, title: "Lighting Design", copy: "Warm ambience, fairy lights, stage focus, entry glow, and camera-friendly setup." },
          { icon: <Camera size={22} />, title: "Media Ready", copy: "Photography, cinematography, drone coverage, and live streaming coordination." },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-card-bg p-6 border-[4px] border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-2xl hover:border-gold"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-[#ead27a] bg-[#fff8dc] text-[#8a6a00] transition-all duration-300 group-hover:scale-110">{item.icon}</div>
            <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-black/60">{item.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
