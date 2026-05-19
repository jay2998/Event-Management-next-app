"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTitle from "../components/PageTitle";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ed] px-4 py-16 text-[#3d2c1f]">
      <PageTitle title="Terms of Service" description="EventPro Terms of Service" />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8b7355] transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="mb-8 font-serif text-4xl font-bold text-[#3d2c1f]">Terms of Service</h1>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Acceptance</h2>
          <p className="leading-relaxed text-black/60">
            By accessing or using EventPro services, you agree to be bound by these Terms of Service. If you do not
            agree, please do not use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Services</h2>
          <p className="leading-relaxed text-black/60">
            EventPro provides event planning and management tools. We reserve the right to modify, suspend, or
            discontinue any aspect of our services at any time with reasonable notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">User Obligations</h2>
          <p className="leading-relaxed text-black/60">
            You agree to provide accurate information, use the service lawfully, and not engage in any activity that
            disrupts or interferes with the platform. You are responsible for maintaining the confidentiality of your
            account credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Limitation of Liability</h2>
          <p className="leading-relaxed text-black/60">
            EventPro shall not be liable for any indirect, incidental, or consequential damages arising from your use of
            the service. Our total liability is limited to the amount you paid for the specific service giving rise to
            the claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[#3d2c1f]">Contact</h2>
          <p className="leading-relaxed text-black/60">
            For questions about these terms, reach us at{" "}
            <span className="font-semibold text-[#3d2c1f]">legal@eventpro.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
