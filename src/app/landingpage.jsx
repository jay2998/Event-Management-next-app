"use client";

import PageTitle from "./components/PageTitle";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { contactApi } from "../lib/api";
import { ChevronUp, MessageCircle } from "lucide-react";
import { CATEGORY_GROUPS, EVENT_CATEGORIES } from "../lib/categories";
import NeobrutalistMarquee from "./components/NeobrutalistMarquee";
import LandingHeader from "./components/LandingHeader";
import HeroSection from "./components/HeroSection";
import LandingPageSections from "./components/LandingPageSections";
import LandingFooter from "./components/LandingFooter";
import FadeIn from "./components/FadeIn";

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "50+", label: "Venue Partners" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "32", label: "Service Categories" },
];

export default function Home() {
  const [showTop, setShowTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialPaused, setTestimonialPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setTestimonialPaused(mq.matches);
    const onChange = (e) => setTestimonialPaused(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowTop(y > 400);
      setScrolled(y > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (testimonialPaused) return;
    const id = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonialPaused]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (dir) => setLightboxIndex((prev) => (prev + dir + 7) % 7);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const contactLastSent = useRef(0);
  const handleContact = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - contactLastSent.current < 10000) {
      setContactError("Please wait 10 seconds before sending another message.");
      return;
    }
    setContactLoading(true);
    setContactError("");
    try {
      await contactApi.send(contact);
      contactLastSent.current = Date.now();
      setContactSent(true);
      setContact({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setContactError(err.message || "Could not send message.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Home" description="EventPro - Wedding & Event Management" />
      <div className="min-h-screen bg-background text-foreground">
        <LandingHeader scrolled={scrolled} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="h-[52px] sm:h-[56px]" />

        <main>
          <HeroSection />

          <NeobrutalistMarquee items={EVENT_CATEGORIES} />

          <section className="bg-gradient-to-r from-warm-brown to-foreground py-12">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((stat, i) => (
                  <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
                    <div className="text-3xl font-black text-gold md:text-4xl">{stat.value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-white/70">{stat.label}</div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <LandingPageSections
            testimonialIndex={testimonialIndex}
            setTestimonialIndex={setTestimonialIndex}
            testimonialPaused={testimonialPaused}
            setTestimonialPaused={setTestimonialPaused}
            lightboxIndex={lightboxIndex}
            openLightbox={openLightbox}
            closeLightbox={closeLightbox}
            navigateLightbox={navigateLightbox}
            contact={contact}
            setContact={setContact}
            contactSent={contactSent}
            setContactSent={setContactSent}
            contactLoading={contactLoading}
            contactError={contactError}
            handleContact={handleContact}
            CATEGORY_GROUPS={CATEGORY_GROUPS}
            EVENT_CATEGORIES={EVENT_CATEGORIES}
          />
        </main>

        <LandingFooter />

        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40"
        >
          <MessageCircle size={26} />
        </motion.a>

        <motion.button
          initial={false}
          animate={showTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center border border-gold bg-gold text-white shadow-lg transition-colors hover:bg-gold-hover hover:shadow-xl hover:shadow-[#d4af37]/40 active:scale-90"
          style={{ pointerEvents: showTop ? "auto" : "none" }}
        >
          <ChevronUp size={22} />
        </motion.button>
      </div>
    </>
  );
}
