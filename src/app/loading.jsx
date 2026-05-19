export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fcf8f2]">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#d4af37]/20 border-t-[#d4af37]" />
      <span className="text-xs font-black uppercase tracking-[0.14em] text-black/50">
        Loading&hellip;
      </span>
    </div>
  );
}
