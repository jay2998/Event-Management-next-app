"use client";

import { useState } from "react";
import { Loader2, Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EnquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { contactApi } = await import("../../lib/api.js");
      await contactApi.send(form);
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not submit enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fcf8f2] px-4">
        <div className="w-full max-w-md border-[4px] border-[#c4b096] bg-[#f9f3e8] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20">
            <Sparkles size={28} className="text-[#d4af37]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#3d2c1f]">Thank You!</h1>
          <p className="mt-2 text-sm text-black/60">Your enquiry has been received. We&apos;ll get back to you shortly.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#c4975a] underline underline-offset-2">
            <ArrowLeft size={14} /> Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fcf8f2] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="border-[4px] border-[#c4b096] bg-[#f9f3e8] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-[#3d2c1f]">Submit an Enquiry</h1>
            <p className="mt-1 text-xs text-black/55 italic">Tell us about your event needs</p>
          </div>

          {error && (
            <div className="mt-4 border-[2.5px] border-red-300 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/60">Name</span>
              <input name="name" value={form.name} onChange={handleChange} required
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none focus:border-[#d4af37] placeholder:text-black/30" />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/60">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none focus:border-[#d4af37] placeholder:text-black/30" />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/60">Phone</span>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none focus:border-[#d4af37] placeholder:text-black/30" />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/60">Message</span>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none focus:border-[#d4af37] placeholder:text-black/30 resize-none" />
            </label>
            <button type="submit" disabled={submitting}
              className="w-full border-[2.5px] border-[#d4af37] bg-[#d4af37] px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-[#c4a030] disabled:opacity-50">
              {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" />Sending...</span> : <span className="flex items-center justify-center gap-2"><Send size={14} />Send Enquiry</span>}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-black/55">
            <Link href="/" className="font-bold text-[#3d2c1f] underline underline-offset-2 hover:text-[#d4af37]">&larr; Back to homepage</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
