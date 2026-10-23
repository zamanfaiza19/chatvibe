"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async () => {
    setEmail("demo@formchat.app");
    setPassword("password123");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@formchat.app", password: "password123" }),
      });

      if (!res.ok) {
        throw new Error("Demo login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login with demo account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col font-sans selection:bg-bronze-500 selection:text-umber-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-umber-900/40 rounded-3xl border border-umber-800 p-8 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
            {/* Top Logo */}
            <div className="text-center mb-6">
              <div className="size-12 rounded-2xl bg-bronze-metal flex items-center justify-center text-umber-950 mx-auto shadow-md mb-3">
                <MessageSquare className="size-6 fill-umber-950" />
              </div>
              <h1 className="font-display text-2xl font-bold text-umber-50">
                {mode === "login" ? "Sign in to Formchat" : "Create your Formchat account"}
              </h1>
              <p className="text-xs text-umber-300 mt-1">
                {mode === "login"
                  ? "Access your dashboard, form builders, and submissions."
                  : "Start building interactive conversational forms in seconds."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-umber-950 p-1 rounded-xl border border-umber-800 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-bronze-metal text-umber-950 shadow-sm"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === "signup"
                    ? "bg-bronze-metal text-umber-950 shadow-sm"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-umber-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-umber-950/80 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-bronze-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-umber-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-umber-950/80 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-bronze-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-umber-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs bg-umber-950/80 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-bronze-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-umber-400 hover:text-amber-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-full bg-bronze-metal text-umber-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Processing..." : mode === "login" ? "Sign In →" : "Create Account →"}</span>
              </button>
            </form>

            {/* Quick Demo Test Access */}
            <div className="mt-6 pt-5 border-t border-umber-800/80 text-center">
              <p className="text-[11px] text-umber-400 mb-2">Want to evaluate without typing?</p>
              <button
                type="button"
                onClick={handleFastDemoLogin}
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>⚡ 1-Click Demo Login (demo@formchat.app)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
