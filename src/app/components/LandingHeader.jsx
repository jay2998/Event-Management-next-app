"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Makeup", href: "#makeup" },
  { label: "Menu", href: "#menu" },
  { label: "Decor", href: "#decor" },
  { label: "Weddings", href: "#weddings" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function LandingHeader({ scrolled, mobileOpen, setMobileOpen }) {
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#e2dace]/80 bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-background"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 transition-all duration-300 hover:opacity-80">
            <img src="/logo.svg" alt="" className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-serif text-xs font-bold tracking-tight sm:text-sm">EventPro</span>
            <span className="hidden sm:inline text-[7px] font-black uppercase tracking-[0.12em] text-accent ml-0.5">Wedding & Event</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="relative text-xs font-black uppercase tracking-[0.16em] text-foreground/75 transition-all duration-300 hover:text-accent hover:-translate-y-0.5 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#e8c878] after:transition-all after:duration-300 hover:after:w-full">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline text-xs font-black uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:text-accent hover:-translate-y-0.5">Login</Link>
            <Link href="/bookings" className="bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-md shadow-[#c4975a]/25 transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-lg hover:shadow-[#c4975a]/40 active:scale-95">Book Event</Link>
            <button onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-light text-foreground/70 lg:hidden hover:bg-white/60 transition-colors">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

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
              className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-card-bg border-l-2 border-border shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
                <span className="text-sm font-black uppercase tracking-[0.15em] text-foreground">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white/60 text-text-muted hover:bg-white">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-4 py-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-bold text-text-muted transition hover:bg-white/80 hover:text-foreground border-l-3 border-transparent hover:border-[#c4975a]">
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-[#c4b096]/40 pt-4 px-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg border-2 border-border bg-white/80 px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.12em] text-text-muted transition hover:border-[#c4975a] hover:bg-white mb-2">
                    Login
                  </Link>
                  <Link href="/bookings" onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg bg-accent px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-accent/90">
                    Book Event
                  </Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
