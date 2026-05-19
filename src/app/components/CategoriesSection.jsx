"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SectionIntro from "./SectionIntro";

export default function CategoriesSection({ CATEGORY_GROUPS, EVENT_CATEGORIES }) {
  return (
    <section id="categories" className="bg-[#fcf6ed] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionIntro eyebrow="32 Categories" title="Built for how events are actually managed in Pakistan" copy="Every category can become a booking request, giving clients clarity and admins a cleaner operations dashboard." />
        <div className="grid gap-6 lg:grid-cols-3">
          {CATEGORY_GROUPS.map((group, gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: gi * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-card-bg p-5 border-[4px] border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-xl hover:border-gold"
            >
              <h3 className="!mb-0 !text-xl !not-italic !tracking-normal">{group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {EVENT_CATEGORIES.filter((c) => c.group === group).map((category) => (
                  <Link key={category.key} href={`/bookings?category=${category.key}`}
                    className="border-[4px] border-border bg-card-bg px-3 py-2 text-xs font-bold text-black/70 transition-all duration-300 hover:bg-gold-light hover:border-gold hover:text-[#8a6a00] hover:-translate-y-0.5 hover:shadow-md active:scale-95">
                    {category.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-accent transition-all duration-300 hover:text-gold hover:-translate-y-0.5 hover:gap-3">
            Admins can manage all 32 categories in the dashboard<ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
