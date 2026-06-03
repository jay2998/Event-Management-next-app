"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ShieldCheck, Store, User } from "lucide-react";

const ROLES = [
  { key: "admin", label: "Admin", icon: <ShieldCheck size={16} />, desc: "Full system access, user management, all bookings" },
  { key: "vendor", label: "Vendor", icon: <Store size={16} />, desc: "Service fulfillment, inventory, order management" },
  { key: "customer", label: "Customer", icon: <User size={16} />, desc: "My bookings, event planning, invoices" },
];

const DEMO_CREDENTIALS = {
  admin: { email: "admin@eventpro.com", password: "admin123" },
  vendor: { email: "vendor@eventpro.com", password: "vendor123" },
  customer: { email: "customer@eventpro.com", password: "customer123" },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const DEMO_USERS = {
    admin:    { name: "Admin User",    email: "admin@eventpro.com",    role: "admin" },
    vendor:   { name: "Vendor User",   email: "vendor@eventpro.com",   role: "vendor" },
    customer: { name: "Customer User", email: "customer@eventpro.com", role: "customer" },
  };

  const loginLocally = (user) => {
    window.localStorage.setItem("token", "demo-token-" + user.role);
    window.localStorage.setItem("user", JSON.stringify(user));
    router.push(user.role === "customer" ? "/enquiry" : "/dashboard");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { authApi } = await import("../../lib/api.js");
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
      const msg = err.message?.toLowerCase() || "";
      const isNetworkError = msg.includes("fetch") || msg.includes("network") || msg.includes("econnrefused") || msg.includes("enotfound") || msg.includes("econnreset");

      if (isNetworkError) {
        const match = Object.values(DEMO_USERS).find((u) => u.email === email);
        if (match && DEMO_CREDENTIALS[match.role]?.password === password) {
          loginLocally(match);
          return;
        }
        setError("Cannot connect to server. Use the demo credentials shown above and click Auto-fill, then sign in with the backend running.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
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

          <div className="mt-3 flex items-center justify-between border-[2.5px] border-[#e8e0d2] bg-white px-3 py-2">
            <span className="text-xs text-black/45">
              Demo: <span className="font-mono font-bold text-black/70">{DEMO_CREDENTIALS[role].email}</span>
            </span>
            <button
              type="button"
              onClick={fillDemo}
              className="text-[11px] font-black uppercase tracking-[0.12em] text-[#c4975a] transition-colors hover:text-[#d4af37]"
            >
              Auto-fill
            </button>
          </div>

          {error && (
            <div className="mt-4 border-[2.5px] border-red-300 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-3 space-y-2.5">
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                <Mail size={14} className="text-[#c4975a]" />
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full border-[2.5px] border-[#e8e0d2] bg-white px-2.5 py-1.5 text-sm text-[#3d2c1f] outline-none transition-all duration-300 focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] placeholder:text-black/30"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                <Lock size={14} className="text-[#c4975a]" />
                Password
              </span>
              <input
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

            <div className="mt-3 text-center">
              <a
                href="/forgot-password"
                className="text-[11px] text-black/45 underline underline-offset-2 transition-colors hover:text-[#c4975a]"
              >
                Forgot password?
              </a>
            </div>
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
