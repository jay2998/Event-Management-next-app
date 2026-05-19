"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorFallback({ error, reset }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-[#c4b096] bg-[#f7f3ed] text-[#8b7355]">
        <AlertTriangle size={24} />
      </span>
      <div className="text-center">
        <h2 className="text-base font-black text-[#3d2c1f]">Something went wrong</h2>
        <p className="mt-1 max-w-sm text-xs leading-5 text-black/55">{error?.message || "An unexpected error occurred."}</p>
      </div>
      <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-md transition hover:bg-[#c4a030] active:scale-[0.97]">
        <RefreshCw size={14} /> Try Again
      </button>
    </div>
  );
}
