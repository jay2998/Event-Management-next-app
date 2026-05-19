"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionIntro from "./SectionIntro";

const gallery = [
  { src: "/images/BTS.png", label: "Behind the scenes", description: "Setup and preparation moments captured during live event production and coordination." },
  { src: "/images/Birthday.png", label: "Celebration styling", description: "Themed decor and styling for birthday celebrations, from intimate gatherings to grand parties." },
  { src: "/images/Aqeeqah.png", label: "Family gatherings", description: "Elegant family event setups including aqeeqah ceremonies and private family celebrations." },
  { src: "/images/menutable.png", label: "Catering and menu design", description: "Buffet spreads, live stations, and beautifully presented Pakistani cuisine for wedding guests." },
  { src: "/images/MenuTasting.png", label: "Menu tasting", description: "Client tasting sessions where menus are refined and dishes are selected for the event." },
  { src: "/images/Dashboard.png", label: "Client dashboard", description: "The event management dashboard — bookings, venue status, and operations at a glance." },
  { src: "/images/planning.png", label: "Planning process", description: "Behind-the-scenes of the planning workflow — timelines, vendor coordination, and logistics." },
];

export default function GallerySection({ lightboxIndex, openLightbox, closeLightbox, navigateLightbox }) {
  return (
    <section id="gallery" className="bg-warm-brown py-20 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionIntro eyebrow="Gallery" title="A glimpse of the experience" copy="Real planning needs visual confidence. Browse the spaces, menus, and production details that help clients imagine the day clearly." dark />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.figure
              key={item.src || item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.03 }}
              className="relative h-56 overflow-hidden rounded-lg cursor-pointer shadow-md"
              onClick={() => openLightbox(index)}
            >
              <Image src={item.src} alt={item.label} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 transition-all duration-300 hover:pb-5">
                <div className="text-sm font-black uppercase tracking-[0.12em] text-white">{item.label}</div>
                <div className="mt-1 text-xs leading-5 text-white/60 line-clamp-2">{item.description}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="dialog" aria-modal="true" aria-labelledby="lightbox-label"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button type="button" aria-label="Close lightbox" className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110 hover:shadow-lg" onClick={closeLightbox}><X size={22} /></button>

            <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110">
              <ChevronLeft size={24} />
            </button>

            <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110">
              <ChevronRight size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].label} width={1200} height={675} className="max-h-[75vh] max-w-[90vw] object-contain" />
              <div className="mt-4 text-center">
                <div id="lightbox-label" className="text-lg font-bold text-white">{gallery[lightboxIndex].label}</div>
                <div className="mt-1 max-w-lg text-sm leading-6 text-white/65">{gallery[lightboxIndex].description}</div>
              </div>
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">{lightboxIndex + 1} / {gallery.length}</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
