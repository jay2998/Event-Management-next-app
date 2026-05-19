"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed right-4 top-4 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id}
            className="animate-slide-in rounded-xl border-[2.5px] border-[#c4b096] bg-[#F9F7F2] px-4 py-3 shadow-2xl flex items-center gap-2.5 min-w-[260px] max-w-sm">
            {t.type === "success"
              ? <CheckCircle size={18} className="text-green-600 shrink-0" />
              : <AlertCircle size={18} className="text-red-600 shrink-0" />
            }
            <span className="text-xs font-bold text-[#3d2c1f] flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="text-black/30 hover:text-black/60 shrink-0"><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
