"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { contactApi } from "../lib/api";
import {
  Award, CalendarCheck, Camera, Check, ChevronLeft, ChevronRight, ChevronUp,
  Flower2, MapPin, Menu, MessageCircle, Music, Palette, Phone, ShieldCheck,
  Sparkles, Star, Utensils, X,
} from "lucide-react";
import { CATEGORY_GROUPS, EVENT_CATEGORIES } from "../lib/categories";
import NeobrutalistMarquee from "./components/NeobrutalistMarquee";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Makeup", href: "#makeup" },
  { label: "Menu", href: "#menu" },
  { label: "Decor", href: "#decor" },
  { label: "Weddings", href: "#weddings" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const serviceCards = [
  { title: "Wedding Planning", image: "/images/VenueDetails.png", icon: <Sparkles size={18} />, copy: "Mehndi, baraat, walima, nikkah, and family-hosted celebrations planned with calm precision.", href: "/bookings?category=event-timeline" },
  { title: "Catering & Live Stalls", image: "/images/Catering.png", icon: <Utensils size={18} />, copy: "Menus built for Pakistani hospitality, one-dish compliance, live stations, and polished service.", href: "/bookings?category=catering-services" },
  { title: "Corporate Events", image: "/images/Corporate.png", icon: <ShieldCheck size={18} />, copy: "Conferences, award nights, launches, and executive dinners with reliable operations.", href: "/bookings?category=guest-management" },
  { title: "Private Celebrations", image: "/images/Birthday2.png", icon: <CalendarCheck size={18} />, copy: "Birthdays, aqeeqah, anniversaries, bridal showers, and intimate family gatherings.", href: "/bookings?category=thematic-decor" },
];

const weddingMoments = ["Engagement", "Dholki", "Mayun", "Mehndi", "Nikkah", "Baraat", "Walima", "Reception"];

const gallery = [
  { src: "/images/BTS.png", label: "Behind the scenes", description: "Setup and preparation moments captured during live event production and coordination." },
  { src: "/images/Birthday.png", label: "Celebration styling", description: "Themed decor and styling for birthday celebrations, from intimate gatherings to grand parties." },
  { src: "/images/Aqeeqah.png", label: "Family gatherings", description: "Elegant family event setups including aqeeqah ceremonies and private family celebrations." },
  { src: "/images/menutable.png", label: "Catering and menu design", description: "Buffet spreads, live stations, and beautifully presented Pakistani cuisine for wedding guests." },
  { src: "/images/MenuTasting.png", label: "Menu tasting", description: "Client tasting sessions where menus are refined and dishes are selected for the event." },
  { src: "/images/Dashboard.png", label: "Client dashboard", description: "The event management dashboard — bookings, venue status, and operations at a glance." },
  { src: "/images/planning.png", label: "Planning process", description: "Behind-the-scenes of the planning workflow — timelines, vendor coordination, and logistics." },
];

const testimonials = [
  { name: "Ayesha & Usman", role: "Wedding, March 2026", text: "EventPro handled our entire wedding week — mehndi, baraat, and walima. Every detail was flawless. Our families are still talking about the decor and catering.", rating: 5 },
  { name: "Fatima Khan", role: "Corporate Gala, Jan 2026", text: "We entrusted our annual corporate dinner to EventPro and they delivered beyond expectations. The coordination, setup, and professionalism were world-class.", rating: 5 },
  { name: "Ahmed & Zara", role: "Nikkah Reception, Feb 2026", text: "From venue selection to the final plate, everything was seamless. The team was always available and handled all our family's requests with grace.", rating: 5 },
  { name: "Sara Malik", role: "Birthday Celebration, Dec 2025", text: "The birthday decor was absolutely stunning. Every guest asked who planned it. The attention to detail and personal touch made all the difference.", rating: 5 },
];

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "50+", label: "Venue Partners" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "32", label: "Service Categories" },
];

function CtaLink({ href, children, variant = "primary" }) {
  const base = "inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all duration-300";
  const primary = "border-[#c4975a] bg-[#c4975a] text-white shadow-md shadow-[#c4975a]/25 hover:scale-[1.04] hover:bg-[#b8894d] hover:shadow-lg hover:shadow-[#c4975a]/40 hover:-translate-y-0.5 active:scale-[0.98]";
  const secondary = "border-white/70 bg-white/10 text-white shadow-md shadow-black/10 hover:scale-[1.04] hover:bg-white hover:text-[#3d2c1f] hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:scale-[0.98]";
  return <Link href={href} className={`${base} ${variant === "primary" ? primary : secondary}`}>{children}<ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" /></Link>;
}

function SectionIntro({ eyebrow, title, copy, dark }) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl text-center ${dark ? "text-white" : ""}`}>
      <div className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${dark ? "text-[#e8c878]" : "text-[#c4975a]"}`}>{eyebrow}</div>
      <h2 className={`!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl ${dark ? "!text-white" : "!text-[#3d2c1f]"}`}>{title}</h2>
      <p className={`mt-4 text-base leading-7 ${dark ? "text-white/90" : "text-black/62"}`}>{copy}</p>
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8 select-none">
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 60 20" className="h-6 w-16 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,10 Q15,0 30,10 Q45,20 60,10" strokeOpacity="0.7" />
          <path d="M2,10 Q15,3 30,10 Q45,17 58,10" strokeOpacity="0.4" strokeWidth="0.8" />
        </svg>
        <div className="absolute h-2.5 w-2.5 animate-ornament-spin rounded-full border-2 border-[#d4af37]" />
      </div>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
    </div>
  );
}

function FadeIn({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const directionVariants = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: -40 },
    right: { x: 40 },
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CornerFrame({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-[3px] border-t-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-[#d4af37]" />
      <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-[3px] border-t-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-[#d4af37]" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-l-[3px] border-b-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-[#d4af37]" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-r-[3px] border-b-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-[#d4af37]" />
      {children}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "fill-[#d4af37] text-[#d4af37]" : "text-white/30"} />
      ))}
    </div>
  );
}

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
  const featuredCategories = EVENT_CATEGORIES;

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
    const id = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (dir) => setLightboxIndex((prev) => (prev + dir + gallery.length) % gallery.length);

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

  const handleContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");
    try {
      await contactApi.send(contact);
      setContactSent(true);
      setContact({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setContactError(err.message || "Could not send message.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── STICKY HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#e2dace]/80 bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-background"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 transition-all duration-300 hover:opacity-80">
            <img src="/logo.svg" alt="" className="h-5 w-auto sm:h-6" />
            <span className="font-serif text-sm font-bold tracking-tight sm:text-base">EventPro</span>
            <span className="hidden sm:inline text-[7px] font-black uppercase tracking-[0.12em] text-[#c4975a] ml-0.5">Wedding & Event</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="relative text-xs font-black uppercase tracking-[0.16em] text-foreground/75 transition-all duration-300 hover:text-[#c4975a] hover:-translate-y-0.5 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#e8c878] after:transition-all after:duration-300 hover:after:w-full">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline text-xs font-black uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:text-[#c4975a] hover:-translate-y-0.5">Login</Link>
            <Link href="/bookings" className="bg-[#c4975a] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-md shadow-[#c4975a]/25 transition-all duration-300 hover:scale-105 hover:bg-[#b8894d] hover:shadow-lg hover:shadow-[#c4975a]/40 active:scale-95">Book Event</Link>
            <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2dace] text-foreground/70 lg:hidden hover:bg-white/60 transition-colors">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-[#f9f3e8] border-l-2 border-[#c4b096] shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-[#c4b096] px-5 py-4">
                <span className="text-sm font-black uppercase tracking-[0.15em] text-[#3d2c1f]">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c4b096] bg-white/60 text-[#5c4a3a] hover:bg-white">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-4 py-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-bold text-[#5c4a3a] transition hover:bg-white/80 hover:text-[#3d2c1f] border-l-3 border-transparent hover:border-[#c4975a]">
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-[#c4b096]/40 pt-4 px-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg border-2 border-[#c4b096] bg-white/80 px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.12em] text-[#5c4a3a] transition hover:border-[#c4975a] hover:bg-white mb-2">
                    Login
                  </Link>
                  <Link href="/bookings" onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg bg-[#c4975a] px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b8894d]">
                    Book Event
                  </Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPACER FOR FIXED HEADER ── */}
      <div className="h-[52px] sm:h-[56px]" />

      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section id="home" className="relative flex min-h-[560px] items-center overflow-hidden md:min-h-[calc(100vh-56px)]">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            src="/images/Wedding.png" alt="A Pakistani wedding stage with elegant decor"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d2c1f]/85 via-[#3d2c1f]/50 to-transparent" />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1fr_360px] lg:items-end">
            <FadeIn className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-5 inline-flex border border-[#e8c878]/40 bg-[#4a3528]/60 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#e8c878] backdrop-blur-md relative overflow-hidden"
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
            </FadeIn>
            <FadeIn delay={0.3}>
              <CornerFrame className="border-[2.5px] border-[#e8c878]/30 bg-[#4a3528]/40 p-5 text-white backdrop-blur-md transition-all duration-500 hover:bg-[#4a3528]/60 hover:shadow-2xl hover:shadow-black/20 group">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#e8c878]"><Award size={16} />Complete Event Suite</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {["32 service categories", "Live booking dashboard", "Vendor coordination", "Client-ready planning"].map((item) => (
                    <div key={item} className="border-[2.5px] border-[#e8c878]/20 bg-[#3d2c1f]/30 p-3 transition-all duration-300 hover:bg-[#e8c878]/10 hover:border-[#e8c878]/40 hover:-translate-y-0.5">{item}</div>
                  ))}
                </div>
              </CornerFrame>
            </FadeIn>
          </div>
        </section>

        <NeobrutalistMarquee items={EVENT_CATEGORIES} />

        {/* ═══════════ STATS ═══════════ */}
        <section className="bg-gradient-to-r from-[#4a3528] to-[#3d2c1f] py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
                  <div className="text-3xl font-black text-[#d4af37] md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-white/70">{stat.label}</div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES ═══════════ */}
        <FadeIn>
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
                    className="group flex flex-col bg-[#f9f3e8] h-full border-[4px] border-[#c4b096] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 hover:border-[#d4af37]">
                    <div className="bg-[#ece6dc] overflow-hidden">
                      <img src={service.image} alt={service.title} loading="lazy" className="w-full block transition-all duration-700 group-hover:scale-110 group-hover:rotate-0" />
                    </div>
                    <div className="flex flex-col p-5 flex-1">
                      <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#c4975a] transition-colors duration-300 group-hover:text-[#b8894d]">{service.icon}Service</div>
                      <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal transition-colors duration-300 group-hover:text-[#c4af37]">{service.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/60 flex-1">{service.copy}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#c4975a] transition-all duration-300 group-hover:gap-3 group-hover:text-[#d4af37]">Start booking <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ MAKEUP ═══════════ */}
        <FadeIn>
          <section id="makeup" className="bg-[#fcf6ed] py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                src="/images/MakeupStyling.png" alt="Bridal and groom styling" loading="lazy"
                className="h-[440px] w-full object-cover shadow-lg"
              />
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#c4975a]"><Palette size={16} />Bridal & Groom Styling</div>
                <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl text-[#3d2c1f]">Flawless artistry for your big day.</h2>
                <p className="mt-5 text-base leading-7 text-black/62">Professional makeup styling for brides and grooms. Expert artists for mehndi, baraat, and walima looks that last all day and look stunning in photos.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {["HD Bridal Makeup", "Groom Styling", "Mehndi Looks", "Trial Sessions", "Hair Styling"].map((item) => (
                    <span key={item} className="border-[4px] border-[#c4b096] bg-[#f9f3e8] px-4 py-2 text-sm font-bold transition-all duration-300 hover:bg-[#f5ecd9] hover:border-[#d4af37] hover:-translate-y-0.5 hover:shadow-md cursor-default">{item}</span>
                  ))}
                </div>
                <div className="mt-8"><CtaLink href="/bookings?category=makeup-styling">Book Styling Session</CtaLink></div>
              </div>
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ MENU ═══════════ */}
        <FadeIn direction="right">
          <section id="menu" className="bg-[#fcf6ed] py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#c4975a]"><Utensils size={16} />Menu & Catering</div>
                <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl text-[#3d2c1f]">Food that feels generous, organized, and deeply familiar.</h2>
                <p className="mt-5 text-base leading-7 text-black/62">Build Pakistani menus with buffet service, live BBQ, chaat stations, desserts, tea service, and one-dish aware planning for wedding events.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {["Biryani", "BBQ", "Karahi", "Live Chaat", "Desserts", "Tea Service"].map((item) => (
                    <span key={item} className="border-[4px] border-[#c4b096] bg-[#f9f3e8] px-4 py-2 text-sm font-bold transition-all duration-300 hover:bg-[#f5ecd9] hover:border-[#d4af37] hover:-translate-y-0.5 hover:shadow-md cursor-default">{item}</span>
                  ))}
                </div>
                <div className="mt-8"><CtaLink href="/bookings?category=catering-services">Book Catering</CtaLink></div>
              </div>
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                src="/images/Food.png" alt="Pakistani wedding catering" loading="lazy"
                className="h-[440px] w-full object-cover shadow-lg"
              />
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ DECOR ═══════════ */}
        <FadeIn>
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
                  className="bg-[#f9f3e8] p-6 border-[4px] border-[#c4b096] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-2xl hover:border-[#d4af37]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-[#ead27a] bg-[#fff8dc] text-[#8a6a00] transition-all duration-300 group-hover:scale-110">{item.icon}</div>
                  <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{item.copy}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ WEDDINGS ═══════════ */}
        <FadeIn>
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
                  <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#e8c878]"><Music size={16} />Wedding Flow</div>
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
                        className="block border-[2.5px] border-white/22 bg-white/10 p-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white shadow-md transition-all duration-300 hover:bg-white hover:text-[#8b7355] hover:shadow-xl active:scale-95">
                        {moment}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="bg-[#fcf6ed] py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4">
            <SectionIntro eyebrow="Client Love" title="What our clients say" copy="Real feedback from the events we have had the privilege to plan and execute across Pakistan." />
            <div className="relative mx-auto max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#f9f3e8] border-[4px] border-[#c4b096] p-8 md:p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <StarRating rating={testimonials[testimonialIndex].rating} />
                  <p className="mt-5 text-lg leading-8 italic text-[#3d2c1f]/85">&ldquo;{testimonials[testimonialIndex].text}&rdquo;</p>
                  <div className="mt-6">
                    <div className="text-sm font-black text-[#3d2c1f]">{testimonials[testimonialIndex].name}</div>
                    <div className="text-xs text-black/50 mt-0.5">{testimonials[testimonialIndex].role}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 flex items-center justify-center gap-3">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialIndex ? "w-8 bg-[#c4975a]" : "w-2.5 bg-[#c4b096]/50 hover:bg-[#c4b096]"
                    }`} />
                ))}
              </div>
              <button onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c4b096] bg-white shadow-md hover:border-[#d4af37] transition-colors">
                <ChevronLeft size={18} className="text-[#5c4a3a]" />
              </button>
              <button onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c4b096] bg-white shadow-md hover:border-[#d4af37] transition-colors">
                <ChevronRight size={18} className="text-[#5c4a3a]" />
              </button>
            </div>
          </div>
        </section>

        <OrnamentalDivider />

        {/* ═══════════ GALLERY ═══════════ */}
        <FadeIn>
          <section id="gallery" className="bg-[#4a3528] py-20 text-white">
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
                    style={{ backgroundImage: `url(${item.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    onClick={() => openLightbox(index)}
                  >
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
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
                  onClick={closeLightbox}
                >
                  <button type="button" className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110 hover:shadow-lg" onClick={closeLightbox}><X size={22} /></button>

                  <button type="button" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110">
                    <ChevronLeft size={24} />
                  </button>

                  <button type="button" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110">
                    <ChevronRight size={24} />
                  </button>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].label} className="max-h-[75vh] max-w-[90vw] object-contain" />
                    <div className="mt-4 text-center">
                      <div className="text-lg font-bold text-white">{gallery[lightboxIndex].label}</div>
                      <div className="mt-1 max-w-lg text-sm leading-6 text-white/65">{gallery[lightboxIndex].description}</div>
                    </div>
                  </motion.div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">{lightboxIndex + 1} / {gallery.length}</div>
                </motion.div>
              )}
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ CATEGORIES ═══════════ */}
        <FadeIn>
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
                    className="bg-[#f9f3e8] p-5 border-[4px] border-[#c4b096] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-xl hover:border-[#d4af37]"
                  >
                    <h3 className="!mb-0 !text-xl !not-italic !tracking-normal">{group}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredCategories.filter((c) => c.group === group).map((category) => (
                        <Link key={category.key} href={`/bookings?category=${category.key}`}
                          className="border-[4px] border-[#c4b096] bg-[#f9f3e8] px-3 py-2 text-xs font-bold text-black/70 transition-all duration-300 hover:bg-[#f5ecd9] hover:border-[#d4af37] hover:text-[#8a6a00] hover:-translate-y-0.5 hover:shadow-md active:scale-95">
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#c4975a] transition-all duration-300 hover:text-[#d4af37] hover:-translate-y-0.5 hover:gap-3">
                  Admins can manage all 32 categories in the dashboard<ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ PACKAGES ═══════════ */}
        <FadeIn>
          <section id="packages" className="mx-auto max-w-6xl px-4 py-20">
            <SectionIntro eyebrow="Packages" title="Choose a starting point, then make it yours" copy="Packages help clients move quickly. Your final plan can still be tailored by category, guest count, venue, menu, and family priorities." />
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { name: "Sterling", price: "Rs. 9,999", features: ["Availability registry", "Core planning checklist", "Vendor inquiry support"], href: "/register" },
                { name: "Gilded", price: "Rs. 14,999", features: ["Everything in Sterling", "Inventory coordination", "Event timeline plan"], href: "/register", featured: true },
                { name: "Sovereign", price: "Rs. 24,999", features: ["Everything in Gilded", "Finance overview", "Admin access console"], href: "/register" },
              ].map((tier, ti) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: ti * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`flex flex-col p-8 border-[4px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-2xl hover:border-[#d4af37] ${tier.featured ? "border-[#d4af37] scale-[1.02] shadow-[0_8px_25px_rgba(212,175,55,0.2)]" : ""}`}>
                  <h3 className="!mb-0 !text-2xl !not-italic !tracking-normal">{tier.name}</h3>
                  <div className="mt-4 font-serif text-3xl font-bold text-[#c4975a]">{tier.price}</div>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-black/70">
                    {tier.features.map((feature) => (<li key={feature} className="flex items-center gap-3"><Check size={16} className="text-[#b4975a]" />{feature}</li>))}
                  </ul>
                  <Link href={tier.href} className="mt-8 inline-flex justify-center border border-[#d4af37] bg-[#d4af37] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-md shadow-[#d4af37]/25 transition-all duration-300 hover:scale-[1.03] hover:bg-[#c4a030] hover:shadow-lg hover:shadow-[#d4af37]/40 hover:-translate-y-0.5 active:scale-[0.97]">Select {tier.name}</Link>
                </motion.div>
              ))}
            </div>
          </section>
        </FadeIn>

        <OrnamentalDivider />

        {/* ═══════════ CONTACT ═══════════ */}
        <FadeIn>
          <section id="contact" className="bg-[#4a3528] py-20 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#e8c878]"><MapPin size={16} />Start the conversation</div>
                <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal !text-white md:!text-5xl">Tell us the date. We will help shape the rest.</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Create an account to start a booking request, or sign in if you are already managing events through the dashboard.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CtaLink href="/register">Create Account</CtaLink>
                  <CtaLink href="/login" variant="secondary">Client Login</CtaLink>
                </div>
                <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2"><Phone size={14} className="text-[#e8c878]" />+92 300 1234567</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-[#e8c878]" />Lahore, Pakistan</div>
                </div>
              </div>
              <div className="border-[2.5px] border-white/18 bg-white/8 p-6 transition-all duration-500 hover:bg-white/12 hover:shadow-2xl">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#e8c878]">Send us a message</div>
                {contactSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-5 rounded-lg border border-green-400/30 bg-green-900/20 p-4 text-sm text-green-300"
                  >
                    Thank you! We will get back to you soon.
                    <button onClick={() => setContactSent(false)} className="ml-2 underline underline-offset-2 hover:text-white">Send another</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContact} className="mt-5 space-y-3">
                    {contactError && <div className="rounded-lg border border-red-400/30 bg-red-900/20 p-3 text-xs text-red-300">{contactError}</div>}
                    <input name="name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your name" required
                      className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#d4af37] focus:bg-white/15 placeholder:text-white/40" />
                    <input name="email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email address" required
                      className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#d4af37] focus:bg-white/15 placeholder:text-white/40" />
                    <input name="phone" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="Phone (optional)"
                      className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#d4af37] focus:bg-white/15 placeholder:text-white/40" />
                    <textarea name="message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us about your event..." required rows={3}
                      className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#d4af37] focus:bg-white/15 placeholder:text-white/40 resize-none" />
                    <button type="submit" disabled={contactLoading}
                      className="w-full border border-[#d4af37] bg-[#d4af37] px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md shadow-[#d4af37]/25 transition-all duration-300 hover:scale-[1.02] hover:bg-[#c4a030] hover:shadow-lg hover:shadow-[#d4af37]/40 active:scale-[0.98] disabled:opacity-60">
                      {contactLoading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#3d2c1f] text-white border-t border-[#5c4a3a]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="" className="h-6 w-auto brightness-0 invert" />
                <span className="font-serif text-lg font-bold">EventPro</span>
              </div>
              <p className="text-sm leading-6 text-white/60 max-w-xs">Pakistan-wide wedding planning, catering, decor, and logistics management platform.</p>
              <div className="mt-4 flex gap-3">
                {["Facebook", "Instagram", "YouTube"].map((s) => (
                  <span key={s} className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 hover:text-[#d4af37] transition-colors cursor-pointer">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#e8c878] mb-4">Services</h4>
              <ul className="space-y-2.5">
                {["Wedding Planning", "Catering", "Venue Selection", "Decor & Design", "Corporate Events"].map((s) => (
                  <li key={s}>
                    <Link href="/bookings" className="text-sm text-white/60 hover:text-[#d4af37] transition-colors">{s}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#e8c878] mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "My Bookings", href: "/bookings" },
                  { label: "Create Account", href: "/register" },
                  { label: "Client Login", href: "/login" },
                  { label: "Enquiry", href: "/enquiry" },
                ].map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="text-sm text-white/60 hover:text-[#d4af37] transition-colors">{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#e8c878] mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li className="flex items-center gap-2"><MapPin size={14} className="shrink-0 text-[#e8c878]" />Lahore, Pakistan</li>
                <li className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-[#e8c878]" />+92 300 1234567</li>
                <li className="flex items-center gap-2"><MessageCircle size={14} className="shrink-0 text-[#e8c878]" />WhatsApp</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>&copy; {new Date().getFullYear()} EventPro. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
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
        className="fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40"
      >
        <MessageCircle size={26} />
      </motion.a>

      {/* ── BACK TO TOP ── */}
      <motion.button
        initial={false}
        animate={showTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center border border-[#d4af37] bg-[#d4af37] text-white shadow-lg transition-colors hover:bg-[#c4a030] hover:shadow-xl hover:shadow-[#d4af37]/40 active:scale-90"
        style={{ pointerEvents: showTop ? "auto" : "none" }}
      >
        <ChevronUp size={22} />
      </motion.button>
    </div>
  );
}
