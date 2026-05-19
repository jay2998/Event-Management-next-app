export default function SectionIntro({ eyebrow, title, copy, dark }) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl text-center ${dark ? "text-white" : ""}`}>
      <div className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${dark ? "text-soft-gold" : "text-accent"}`}>{eyebrow}</div>
      <h2 className={`!mb-0 !text-4xl !not-italic !tracking-normal md:!text-5xl ${dark ? "!text-white" : "!text-foreground"}`}>{title}</h2>
      <p className={`mt-4 text-base leading-7 ${dark ? "text-white/90" : "text-black/62"}`}>{copy}</p>
    </div>
  );
}
