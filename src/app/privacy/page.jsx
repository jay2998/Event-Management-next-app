"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTitle from "../components/PageTitle";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ed] px-4 py-16 text-[#3d2c1f]">
      <PageTitle title="Privacy Policy" description="EventPro Privacy Policy" />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8b7355] transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="mb-8 font-serif text-4xl font-bold text-[#3d2c1f]">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Information We Collect</h2>
          <p className="leading-relaxed text-black/60">
            We collect personal information you provide when you use our services, including your name, email address,
            phone number, and event details. We also automatically collect certain usage data to improve your experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">How We Use It</h2>
          <p className="leading-relaxed text-black/60">
            Your information is used to provide, maintain, and improve our event management services, communicate with you
            about your bookings, and send relevant updates. We never sell your personal data to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Data Security</h2>
          <p className="leading-relaxed text-black/60">
            We implement industry-standard security measures to protect your data against unauthorized access, alteration,
            disclosure, or destruction. However, no method of transmission over the internet is completely secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Contact</h2>
          <p className="leading-relaxed text-black/60">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <span className="font-semibold text-[#3d2c1f]">privacy@eventpro.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
