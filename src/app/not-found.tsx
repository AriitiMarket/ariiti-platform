import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ariiti-light flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-ariiti-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          404 — Page Not Found
        </span>
        <h1 className="text-2xl font-bold text-ariiti-navy mt-2 mb-3">
          Requested Page Not Found
        </h1>
        <p className="text-sm text-ariiti-muted leading-relaxed mb-6">
          The page or corporate resource you requested does not exist or has been moved to another section.
        </p>
        <Button href="/" variant="primary" size="md">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Return to Homepage</span>
        </Button>
      </div>
    </div>
  );
}
