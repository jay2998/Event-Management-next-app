export default function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8 select-none">
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 60 20" className="h-6 w-16 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0,10 Q15,0 30,10 Q45,20 60,10" strokeOpacity="0.7" />
          <path d="M2,10 Q15,3 30,10 Q45,17 58,10" strokeOpacity="0.4" strokeWidth="0.8" />
        </svg>
        <div className="absolute h-2.5 w-2.5 animate-ornament-spin rounded-full border-2 border-gold" />
      </div>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
    </div>
  );
}
