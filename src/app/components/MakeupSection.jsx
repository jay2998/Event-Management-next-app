"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import CtaLink from "./CtaLink";

const MotionImage = motion(Image);

export default function MakeupSection() {
  return (
    <section id="makeup" className="bg-[#fcf6ed] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <MotionImage
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          src="/images/MakeupStyling.png" alt="Bridal and groom styling"
          width={836} height={470} sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-[440px] w-full object-cover shadow-lg"
        />
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-accent"><Palette size={16} />Bridal & Groom Styling</div>
          <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl text-foreground">Flawless artistry for your big day.</h2>
          <p className="mt-5 text-base leading-7 text-black/62">Professional makeup styling for brides and grooms. Expert artists for mehndi, baraat, and walima looks that last all day and look stunning in photos.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {["HD Bridal Makeup", "Groom Styling", "Mehndi Looks", "Trial Sessions", "Hair Styling"].map((item) => (
              <span key={item} className="border-[4px] border-border bg-card-bg px-4 py-2 text-sm font-bold transition-all duration-300 hover:bg-gold-light hover:border-gold hover:-translate-y-0.5 hover:shadow-md cursor-default">{item}</span>
            ))}
          </div>
          <div className="mt-8"><CtaLink href="/bookings?category=makeup-styling">Book Styling Session</CtaLink></div>
        </div>
      </div>
    </section>
  );
}
