"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Utensils, ShieldCheck, CalendarCheck } from "lucide-react";
import SectionIntro from "./SectionIntro";

const serviceCards = [
  { title: "Wedding Planning", image: "/images/VenueDetails.png", icon: <Sparkles size={18} />, copy: "Mehndi, baraat, walima, nikkah, and family-hosted celebrations planned with calm precision.", href: "/bookings?category=event-timeline" },
  { title: "Catering & Live Stalls", image: "/images/Catering.png", icon: <Utensils size={18} />, copy: "Menus built for Pakistani hospitality, one-dish compliance, live stations, and polished service.", href: "/bookings?category=catering-services" },
  { title: "Corporate Events", image: "/images/Corporate.png", icon: <ShieldCheck size={18} />, copy: "Conferences, award nights, launches, and executive dinners with reliable operations.", href: "/bookings?category=guest-management" },
  { title: "Private Celebrations", image: "/images/Birthday2.png", icon: <CalendarCheck size={18} />, copy: "Birthdays, aqeeqah, anniversaries, bridal showers, and intimate family gatherings.", href: "/bookings?category=thematic-decor" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20">
      <SectionIntro eyebrow="What We Handle" title="One team for every moving piece" copy="Clients should not have to chase ten vendors to host one event. Start with a service, then shape the booking around your date, guests, budget, and family expectations." />
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {serviceCards.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <Link href={service.href}
              className="group flex flex-col bg-card-bg h-full border-[4px] border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 hover:border-gold">
              <div className="bg-[#ece6dc] overflow-hidden">
                <Image src={service.image} alt={service.title} width={512} height={512} className="w-full block transition-all duration-700 group-hover:scale-110 group-hover:rotate-0" />
              </div>
              <div className="flex flex-col p-5 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-accent transition-colors duration-300 group-hover:text-[#b8894d]">{service.icon}Service</div>
                <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal transition-colors duration-300 group-hover:text-[#c4af37]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60 flex-1">{service.copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-accent transition-all duration-300 group-hover:gap-3 group-hover:text-gold">Start booking <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
