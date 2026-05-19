"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ShadowPopButton from "../components/ShadowPopButton";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { authApi } = await import("../../lib/api.js");
      const res = await authApi.register({ name, email, phone, password });

      const payload = res?.data;
      const token = payload?.token || payload?.data?.token || payload?.data?.accessToken;
      const user = payload?.user || payload?.data?.user;

      if (token) {
        window.localStorage.setItem("token", token);
        if (user) window.localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err?.response?.data?.message || err.message || err);
      alert(err?.response?.data?.message || err.message || "Register failed");
    } finally {
      setLoading(false);
    }

    return;
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-white p-6 shadow-2xl border border-[#e8e1d5]">
          <h1 className="text-3xl text-center">Join the Circle</h1>
          <p className="mt-2 text-center text-xs text-black/60 italic font-light">
            Embark on your journey of professional event management.
          </p>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <label className="block">
              <span className="flex items-center gap-2"><User size={14} className="text-[#b4975a]" /> Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full"
                required
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2"><Mail size={14} className="text-[#b4975a]" /> Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full"
                required
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2"><Phone size={14} className="text-[#b4975a]" /> Phone (optional)</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2"><Lock size={14} className="text-[#b4975a]" /> Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full"
                required
              />
            </label>

            <ShadowPopButton variant="primary" type="submit">
              Commence Partnership
            </ShadowPopButton>
          </form>

          <div className="mt-5 text-xs text-center text-black/70">
            Already a Partner?{" "}
            <a href="/login" className="underline font-bold text-black hover:text-[#d4af37] transition-colors">
              Sign in to your suite.
            </a>
          </div>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-5 border border-[#e2dace] bg-white/60 backdrop-blur-sm shadow-xl"
            >
              <div className="font-serif italic text-base text-black flex items-center gap-2"><Loader2 className="animate-spin text-[#b4975a]" /> Curating your workspace...</div>
              <div className="mt-1 text-xs text-black/70 italic font-light">
                Initializing exclusive tenant workspace and default inventory tiers.
              </div>
              <div className="mt-4 h-1 w-full bg-[#e2dace] rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#b4975a] rounded-full animate-[auth-loading_1.2s_ease-in-out_infinite]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes auth-loading {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(80%); }
          100% { transform: translateX(-10%); }
        }
      `}</style>
    </main>
  );
}
