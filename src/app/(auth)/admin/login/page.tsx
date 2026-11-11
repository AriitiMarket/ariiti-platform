"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "unauthorized_role"
      ? "Access denied. Your staff role does not have permission for that area."
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (!res || res.error) {
        setError(res?.error || "Invalid corporate credentials provided.");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Corporate Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ariititech.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Account Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-ariiti-accent hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-end encrypted session & audit logging active</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Tech Ambient Glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ariiti-navy border border-blue-500/30 flex items-center justify-center text-white mx-auto shadow-xl mb-4">
            <span className="font-black text-2xl tracking-wider text-blue-400">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ariiti Tech Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Internal Staff & Regional Management Gateway
          </p>
        </div>

        {/* Suspense wrapped login card */}
        <Suspense
          fallback={
            <div className="p-8 text-center text-slate-400 text-xs">
              Loading authentication gateway...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Return to website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Ariiti Tech Public Portal
          </a>
        </div>
      </div>
    </div>
  );
}
