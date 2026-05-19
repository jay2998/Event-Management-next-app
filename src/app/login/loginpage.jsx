"use client";

import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { authApi } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
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

      const userRole = user?.role;
      router.push(userRole === "customer" ? "/enquiry" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Login" description="Sign in to your EventPro account" />
      <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcf8f2]">
      <div className="w-full max-w-sm space-y-4">
        <div className="border-[4px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-[#3d2c1f]">Welcome Back</h1>
            <p className="mt-1 text-xs text-black/55 italic">
              Sign in to your planning sanctuary
            </p>
          </div>

          {error && (
            <div className="mt-4 border-[2.5px] border-red-300 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 space-y-2.5">
            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black/60">
                <Mail size={14} className="text-[#c4975a]" />
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
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
                "Sign In"
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
    </>
  );
}
