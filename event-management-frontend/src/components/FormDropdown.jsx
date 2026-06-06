import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function FormDropdown({ show, onClose, title, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b-[2.5px] border-[#c4b096] px-5 py-3">
          <h2 className="text-base font-black text-[#3d2c1f]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
