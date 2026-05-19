import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#fcf8f2] px-4">
      <div className="text-center">
        <div className="font-serif text-8xl font-bold text-[#d4af37]/30">404</div>
        <h1 className="-mt-3 text-3xl font-black text-[#3d2c1f]">Page not found</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-black/55">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-5 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md transition hover:bg-[#c4a030] hover:shadow-lg active:scale-[0.97]"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
