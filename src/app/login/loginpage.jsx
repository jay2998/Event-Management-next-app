"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ShieldCheck, Store, User } from "lucide-react";
import { authApi } from "../../lib/api";
import { localDB } from "../../lib/store";

const ROLES = [
  { key: "admin", label: "Admin", icon: <ShieldCheck size={16} />, desc: "Full system access, user management, all bookings" },
  { key: "vendor", label: "Vendor", icon: <Store size={16} />, desc: "Service fulfillment, inventory, order management" },
  { key: "customer", label: "Customer", icon: <User size={16} />, desc: "My bookings, event planning, invoices" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login({ email, password });
      const payload = res?.data;
      const token = payload?.token || payload?.data?.token || payload?.data?.accessToken;
      const user = payload?.user || payload?.data?.user;

      if (!token) throw new Error(payload?.message || "Login succeeded but token missing");

      window.localStorage.setItem("token", token);
      if (user) window.localStorage.setItem("user", JSON.stringify(user));

      const userRole = user?.role || role;
      router.push(userRole === "customer" ? "/enquiry" : "/dashboard");
    } catch (err) {
      const result = localDB.findAll("users");
      const users = result?.data?.data || [];
      const match = users.find((u) => u.email === email && u.password === password);

      if (match) {
        const { password: _, ...safeUser } = match;
        const localToken = "local_" + btoa(JSON.stringify({ email, ts: Date.now() }));
        window.localStorage.setItem("token", localToken);
        window.localStorage.setItem("user", JSON.stringify(safeUser));
        return router.push(match.role === "customer" ? "/enquiry" : "/dashboard");
      }

      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roleStyles = (key) =>
    key === role
      ? "border-[#d4af37] bg-[#f9f3e8] text-[#3d2c1f] shadow-md"
      : "border-[#e8e0d2] bg-transparent text-black/50 hover:border-[#d4c8b0] hover:text-black/70";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcf8f2]">
      <div className="w-full max-w-sm space-y-4">
        <div className="border-[4px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-[#3d2c1f]">Welcome Back</h1>
            <p className="mt-1 text-xs text-black/55 italic">
              Sign in to your planning sanctuary
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => { setRole(r.key); setError(""); }}
                className={`flex flex-col items-center gap-1 border-[2.5px] px-2 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${roleStyles(r.key)}`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-1.5 text-center text-[10px] text-black/45 italic leading-relaxed">
            {ROLES.find((r) => r.key === role)?.desc}
          </div>

          {error && (
            <div className="mt-4 border-[2.5px] border-red-300 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-3 space-y-2.5">
            <label className="block" htmlFor="login-email">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                <Mail size={14} className="text-[#c4975a]" />
                Email
              </span>
              <input
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30"
                placeholder="you@example.com"
              />
            </label>

            <label className="block" htmlFor="login-password">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                <Lock size={14} className="text-[#c4975a]" />
                Password
              </span>
              <input
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="mt-1.5 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-[2.5px] border-[#d4af37] bg-[#d4af37] px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-md shadow-[#d4af37]/25 transition-all duration-300 hover:bg-[#c4a030] hover:shadow-lg hover:shadow-[#d4af37]/40 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                `Enter as ${ROLES.find((r) => r.key === role)?.label}`
              )}
            </button>

          </form>

          <div className="mt-5 text-center text-xs text-black/55">
            Not registered yet?{" "}
            <a
              href="/register"
              className="font-bold text-[#3d2c1f] underline underline-offset-2 transition-colors hover:text-[#d4af37]"
            >
              Create an account
            </a>
          </div>
        </div>

        <div className="text-center text-[11px] text-black/40">
          <a href="/" className="transition-colors hover:text-[#c4975a]">
            &larr; Back to homepage
          </a>
        </div>
      </div>
    </main>
  );
}
