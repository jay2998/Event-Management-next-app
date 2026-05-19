"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import CtaLink from "./CtaLink";
import CornerFrame from "./CornerFrame";

const MotionImage = motion(Image);

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-[420px] items-center overflow-hidden md:min-h-[600px]">
      <MotionImage
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        whileInView={{ scale: 1 }} viewport={{ once: true }}
        src="/images/Wedding.png" alt="A Pakistani wedding stage with elegant decor"
        fill priority sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#3d2c1f]/85 via-[#3d2c1f]/50 to-transparent" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1fr_360px] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5 inline-flex border border-[#e8c878]/40 bg-[#4a3528]/60 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-soft-gold backdrop-blur-md relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer" />
            Pakistan-wide wedding planning, catering, decor & logistics
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="!mb-0 !text-5xl !not-italic !tracking-normal !text-white md:!text-7xl"
          >
            Your event should feel effortless before it feels unforgettable.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/86"
          >
            From the first guest list to the last plate served, we bring venues, catering, decor, media, transport, and hospitality into one beautifully coordinated event plan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <CtaLink href="/bookings">Plan My Event</CtaLink>
            <CtaLink href="#services" variant="secondary">Explore Services</CtaLink>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <CornerFrame className="border-[2.5px] border-[#e8c878]/30 bg-[#4a3528]/40 p-5 text-white backdrop-blur-md transition-all duration-500 hover:bg-[#4a3528]/60 hover:shadow-2xl hover:shadow-black/20 group">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-soft-gold"><Award size={16} />Complete Event Suite</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {["32 service categories", "Live booking dashboard", "Vendor coordination", "Client-ready planning"].map((item) => (
                <div key={item} className="border-[2.5px] border-[#e8c878]/20 bg-[#3d2c1f]/30 p-3 transition-all duration-300 hover:bg-[#e8c878]/10 hover:border-[#e8c878]/40 hover:-translate-y-0.5">{item}</div>
              ))}
            </div>
          </CornerFrame>
        </motion.div>
      </div>
    </section>
  );
}
