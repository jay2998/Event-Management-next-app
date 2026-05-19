"use client";

import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-foreground text-white border-t border-text-muted">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <img src="/logo.svg" alt="" className="h-4 w-4 brightness-0 invert" />
              <span className="font-serif text-sm font-bold">EventPro</span>
            </div>
            <p className="text-sm leading-6 text-white/60 max-w-xs">Pakistan-wide wedding planning, catering, decor, and logistics management platform.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 hover:text-gold transition-colors">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 hover:text-gold transition-colors">Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 hover:text-gold transition-colors">YouTube</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-soft-gold mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Wedding Planning", "Catering", "Venue Selection", "Decor & Design", "Corporate Events"].map((s) => (
                <li key={s}>
                  <Link href="/bookings" className="text-sm text-white/60 hover:text-gold transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-soft-gold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Bookings", href: "/bookings" },
                { label: "Create Account", href: "/register" },
                { label: "Client Login", href: "/login" },
                { label: "Enquiry", href: "/enquiry" },
              ].map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-sm text-white/60 hover:text-gold transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-soft-gold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-center gap-2"><MapPin size={14} className="shrink-0 text-soft-gold" />Lahore, Pakistan</li>
              <li className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-soft-gold" />+92 300 1234567</li>
              <li className="flex items-center gap-2"><MessageCircle size={14} className="shrink-0 text-soft-gold" />WhatsApp</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} EventPro. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
