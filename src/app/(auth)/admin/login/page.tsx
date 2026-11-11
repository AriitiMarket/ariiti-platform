"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import AriitiLogo from "@/components/ui/AriitiLogo";

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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900">
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5"
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
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5"
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
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all shadow-xs"
            />
          </div>
        </div>

        <div className="pt-2">
          {/* Primary Action Button: Deep navy blue with white text */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-end encrypted session & audit logging active</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brand-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background subtle micro-dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header with Official Ariiti Tech Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <AriitiLogo
            variant="light"
            size="lg"
            subtitle="Internal Operations Gateway"
          />
          <p className="text-xs sm:text-sm text-white/80 mt-2 font-medium">
            Internal Staff & Regional Management Gateway
          </p>
        </div>

        {/* Suspense wrapped login card */}
        <Suspense
          fallback={
            <div className="p-8 text-center text-white/80 text-xs">
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
            className="text-xs text-white/80 hover:text-white transition-colors underline"
          >
            ← Return to Ariiti Tech Public Portal
          </a>
        </div>
      </div>
    </div>
  );
}
