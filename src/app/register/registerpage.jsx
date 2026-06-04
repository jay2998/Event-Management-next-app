"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShadowPopButton from "../components/ShadowPopButton";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { authApi } from "../../lib/api";
import { localDB } from "../../lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.register({ name, email, phone, password });

      const payload = res?.data;
      const token = payload?.token || payload?.data?.token || payload?.data?.accessToken;
      const user = payload?.user || payload?.data?.user;
      const userRole = user?.role || "customer";

      if (token) {
        window.localStorage.setItem("token", token);
        if (user) window.localStorage.setItem("user", JSON.stringify(user));
        return router.push(userRole === "customer" ? "/enquiry" : "/dashboard");
      }
      router.push("/login");
    } catch {
      const result = localDB.create("users", { name, email, phone, password, role: "customer" });
      const newUser = result?.data?.data;
      if (newUser) {
        const { password: _, ...safeUser } = newUser;
        const localToken = "local_" + btoa(JSON.stringify({ email, ts: Date.now() }));
        window.localStorage.setItem("token", localToken);
        window.localStorage.setItem("user", JSON.stringify(safeUser));
        return router.push("/enquiry");
      }
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div className="border-[2.5px] border-red-300 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <label className="block" htmlFor="reg-name">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60"><User size={14} className="text-[#b4975a]" /> Full Name</span>
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </label>

            <label className="block" htmlFor="reg-email">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60"><Mail size={14} className="text-[#b4975a]" /> Email</span>
              <input
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                disabled={loading}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </label>

            <label className="block" htmlFor="reg-phone">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60"><Phone size={14} className="text-[#b4975a]" /> Phone (optional)</span>
              <input
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                disabled={loading}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>

            <label className="block" htmlFor="reg-password">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60"><Lock size={14} className="text-[#b4975a]" /> Password</span>
              <input
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                disabled={loading}
                className="mt-1 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </label>

            <ShadowPopButton variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Registering...
                </span>
              ) : (
                "Commence Partnership"
              )}
            </ShadowPopButton>
          </form>

          <div className="mt-5 text-xs text-center text-black/70">
            Already a Partner?{" "}
            <a href="/login" className="underline font-bold text-black hover:text-[#d4af37] transition-colors">
              Sign in to your suite.
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
