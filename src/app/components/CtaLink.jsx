import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CtaLink({ href, children, variant = "primary" }) {
  const base = "inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all duration-300";
  const primary = "border-accent bg-accent text-white shadow-md shadow-[#c4975a]/25 hover:scale-[1.04] hover:bg-accent/90 hover:shadow-lg hover:shadow-[#c4975a]/40 hover:-translate-y-0.5 active:scale-[0.98]";
  const secondary = "border-white/70 bg-white/10 text-white shadow-md shadow-black/10 hover:scale-[1.04] hover:bg-white hover:text-foreground hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:scale-[0.98]";
  return <Link href={href} className={`${base} ${variant === "primary" ? primary : secondary}`}>{children}<ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" /></Link>;
}
