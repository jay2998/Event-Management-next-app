export default function CornerFrame({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-[3px] border-t-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-gold" />
      <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-[3px] border-t-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-gold" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-l-[3px] border-b-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-gold" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-r-[3px] border-b-[3px] border-[#d4af37]/40 transition-all duration-500 group-hover:h-7 group-hover:w-7 group-hover:border-gold" />
      {children}
    </div>
  );
}
