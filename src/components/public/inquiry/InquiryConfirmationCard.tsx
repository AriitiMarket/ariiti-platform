"use client";

import React from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface InquiryConfirmationCardProps {
  referenceId: string;
  customerName: string;
  requestedServiceTitle: string;
  whatsappNumber: string;
  onReset: () => void;
}

export const InquiryConfirmationCard: React.FC<InquiryConfirmationCardProps> = ({
  referenceId,
  customerName,
  requestedServiceTitle,
  whatsappNumber,
  onReset,
}) => {
  const confirmationWhatsAppUrl = buildWhatsAppUrl(whatsappNumber, {
    name: customerName,
    service: requestedServiceTitle,
    details: `Priority Follow-up for Inquiry Ref #${referenceId}.`,
  });

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 shadow-lg animate-in fade-in duration-200">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Inquiry Logged Successfully
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-ariiti-navy mt-4 mb-2">
          Thank You, {customerName}!
        </h2>

        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
            Official Reference Tracking ID:
          </span>
          <span className="text-2xl font-mono font-black text-ariiti-accent tracking-wider">
            #{referenceId}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Our engineering and operations team has received your technical specifications. An Ariiti Tech specialist will review your requirements and reach out via phone or email within <strong>2 to 4 business hours</strong>.
        </p>

        <div className="space-y-3">
          <a
            href={confirmationWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Reference via WhatsApp for Immediate Priority</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-ariiti-navy underline block mx-auto pt-2 cursor-pointer"
          >
            Submit Another Project Requirement
          </button>
        </div>
      </div>
    </div>
  );
};
