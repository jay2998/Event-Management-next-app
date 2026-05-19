"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionIntro from "./SectionIntro";

const tiers = [
  { name: "Sterling", price: "Rs. 9,999", features: ["Availability registry", "Core planning checklist", "Vendor inquiry support"], href: "/register" },
  { name: "Gilded", price: "Rs. 14,999", features: ["Everything in Sterling", "Inventory coordination", "Event timeline plan"], href: "/register", featured: true },
  { name: "Sovereign", price: "Rs. 24,999", features: ["Everything in Gilded", "Finance overview", "Admin access console"], href: "/register" },
];

export default function PackagesSection() {
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-20">
      <SectionIntro eyebrow="Packages" title="Choose a starting point, then make it yours" copy="Packages help clients move quickly. Your final plan can still be tailored by category, guest count, venue, menu, and family priorities." />
      <div className="grid gap-8 md:grid-cols-3">
        {tiers.map((tier, ti) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: ti * 0.1 }}
            whileHover={{ y: -8 }}
            className={`flex flex-col p-8 border-[4px] border-border bg-card-bg shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-2xl hover:border-gold ${tier.featured ? "border-gold scale-[1.02] shadow-[0_8px_25px_rgba(212,175,55,0.2)]" : ""}`}>
            <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal">{tier.name}</h3>
            <div className="mt-4 font-serif text-3xl font-bold text-accent">{tier.price}</div>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-black/70">
              {tier.features.map((feature) => (<li key={feature} className="flex items-center gap-3"><Check size={16} className="text-[#b4975a]" />{feature}</li>))}
            </ul>
            <Link href={tier.href} className="mt-8 inline-flex justify-center border border-gold bg-gold px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-md shadow-[#d4af37]/25 transition-all duration-300 hover:scale-[1.03] hover:bg-gold-hover hover:shadow-lg hover:shadow-[#d4af37]/40 hover:-translate-y-0.5 active:scale-[0.97]">Select {tier.name}</Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
