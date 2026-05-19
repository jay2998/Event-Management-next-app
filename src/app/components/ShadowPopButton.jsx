export default function ShadowPopButton({ children, variant = "primary", onClick, type = "button" }) {
  const styles = {
    base:
      "inline-flex items-center justify-center gap-2 font-serif italic tracking-widest text-sm border border-[#d4af37] shadow-sm px-8 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm",
    primary: "bg-[#FFD700] text-black hover:bg-[#E6C200]",
    secondary: "bg-white/50 backdrop-blur-sm text-[#d4af37] hover:bg-white",
    ghost: "bg-transparent text-black border-transparent shadow-none hover:text-[#d4af37] font-serif",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
