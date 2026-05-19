"use client";

import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import CtaLink from "./CtaLink";

export default function ContactSection({ contact, setContact, contactSent, setContactSent, contactLoading, contactError, handleContact }) {
  return (
    <section id="contact" className="bg-warm-brown py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-soft-gold"><MapPin size={16} />Start the conversation</div>
          <h2 className="!mb-0 !text-4xl !not-italic !tracking-normal !text-white md:!text-5xl">Tell us the date. We will help shape the rest.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Create an account to start a booking request, or sign in if you are already managing events through the dashboard.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaLink href="/register">Create Account</CtaLink>
            <CtaLink href="/login" variant="secondary">Client Login</CtaLink>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2"><Phone size={14} className="text-soft-gold" />+92 300 1234567</div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-soft-gold" />Lahore, Pakistan</div>
          </div>
        </div>
        <div className="border-[2.5px] border-white/18 bg-white/8 p-6 transition-all duration-500 hover:bg-white/12 hover:shadow-2xl">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-soft-gold">Send us a message</div>
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
                className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/15 placeholder:text-white/40" />
              <input name="email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email address" required
                className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/15 placeholder:text-white/40" />
              <input name="phone" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="Phone (optional)"
                className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/15 placeholder:text-white/40" />
              <textarea name="message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us about your event..." required rows={3}
                className="w-full border-[2.5px] border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/15 placeholder:text-white/40 resize-none" />
              <button type="submit" disabled={contactLoading}
                className="w-full border border-gold bg-gold px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md shadow-[#d4af37]/25 transition-all duration-300 hover:scale-[1.02] hover:bg-gold-hover hover:shadow-lg hover:shadow-[#d4af37]/40 active:scale-[0.98] disabled:opacity-60">
                {contactLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
