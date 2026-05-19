"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#fcf8f2] px-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-red-200 bg-red-50 text-red-500">
        <AlertTriangle size={32} />
      </span>
      <div className="text-center">
        <h1 className="text-2xl font-black text-[#3d2c1f]">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-black/55">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-5 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md transition hover:bg-[#c4a030] hover:shadow-lg active:scale-[0.97]"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
