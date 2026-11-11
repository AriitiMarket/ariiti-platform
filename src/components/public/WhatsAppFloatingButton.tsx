import React from "react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppFloatingButtonProps {
  phone?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phone,
}) => {
  if (!phone) return null;

  const url = buildWhatsAppUrl(phone, {
    details: "I am browsing your corporate platform and would like to speak with an IT solutions engineer.",
  });

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-5 right-5 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ariiti Tech on WhatsApp"
        className="group flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppFloatingButton;
