"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";

export default function NeobrutalistMarquee({ items = [] }) {
  const doubled = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="bg-white/40 backdrop-blur-sm border border-[#e2dace] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#b4975a]/20 bg-[#b4975a]/5">
        <h3 className="text-lg !text-black italic">Popular Categories</h3>
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#b4975a]">Curated for Excellence</div>
      </div>

      <div className="relative">
        <div
          className="flex gap-3 py-4 whitespace-nowrap animate-marquee"
          style={{ width: "max-content" }}
        >
          {doubled.map((it, idx) => (
            <div
              key={`${it.key}-${idx}`}
              className="flex items-center gap-2 border border-[#e2dace] bg-white px-6 py-2"
            >
              <Check size={14} className="text-[#b4975a]" />
              <span className="font-serif italic text-sm">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
