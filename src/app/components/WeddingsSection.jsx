"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

const weddingMoments = ["Engagement", "Dholki", "Mayun", "Mehndi", "Nikkah", "Baraat", "Walima", "Reception"];

export default function WeddingsSection() {
  return (
    <section id="weddings" className="relative bg-[#8b7355] py-20 text-white overflow-hidden">
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.02, 1, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5"
      />
      <motion.div
        animate={{ rotate: [0, -5, 0, 5, 0], scale: [1, 1.01, 1, 1.01, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5"
      />
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-soft-gold"><Music size={16} />Wedding Flow</div>
            <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal !text-white md:!text-5xl">From dholki energy to walima grace, every moment gets a plan.</h2>
            <p className="mt-5 text-base leading-7 text-white/78">We map families, timings, vendor arrivals, entrances, food service, photography windows, and guest hospitality so the day feels smooth.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {weddingMoments.map((moment, i) => (
              <motion.div
                key={moment}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Link href="/bookings?category=event-timeline"
                  className="block border-[2.5px] border-white/22 bg-white/10 p-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white shadow-md transition-all duration-300 hover:bg-white hover:text-taupe hover:shadow-xl active:scale-95">
                  {moment}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
