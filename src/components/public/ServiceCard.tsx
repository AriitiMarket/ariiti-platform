import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IService } from "@/models/Service";
import {
  Code2,
  Network,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ServiceCardProps {
  service: IService;
  showImage?: boolean;
}

const CATEGORY_META: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    imageUrl: string;
    defaultCapabilities: string[];
  }
> = {
  SOFTWARE_DEVELOPMENT: {
    label: "Software Development",
    icon: Code2,
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    defaultCapabilities: [
      "Web Applications & Client Portals",
      "Mobile Applications for Operations",
      "Business Management Systems",
      "Custom Software Solutions",
    ],
  },
  NETWORKING_INFRASTRUCTURE: {
    label: "Networking & IT Infrastructure",
    icon: Network,
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    defaultCapabilities: [
      "LAN and Wi-Fi Installation",
      "Router & Switch Configuration",
      "Structured Network Cabling (Cat6)",
      "Network Troubleshooting & Failover",
    ],
  },
  HARDWARE_EQUIPMENT: {
    label: "Hardware & Technical Support",
    icon: Cpu,
    imageUrl:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
    defaultCapabilities: [
      "Computer Setup and Maintenance",
      "Receipt Printer & Peripheral Setup",
      "UPS and Hardware Installation",
      "Technical Hardware Troubleshooting",
    ],
  },
  IT_MAINTENANCE_SUPPORT: {
    label: "Business Technology Solutions",
    icon: ShieldCheck,
    imageUrl:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    defaultCapabilities: [
      "POS and Billing Systems",
      "Inventory and Sales Management",
      "Business Process Digitization",
      "Preventive Maintenance & SLAs",
    ],
  },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  showImage = true,
}) => {
  const meta = CATEGORY_META[service.category] || {
    label: service.category.replace(/_/g, " "),
    icon: Layers,
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    defaultCapabilities: [
      "Professional Technology Planning",
      "Certified On-Premise Installation",
      "Ongoing Technical Support",
    ],
  };

  const IconComponent = meta.icon;

  // Use provided whatsIncluded if available, otherwise use category capabilities
  const capabilities =
    service.whatsIncluded && service.whatsIncluded.length > 0
      ? service.whatsIncluded.slice(0, 4)
      : meta.defaultCapabilities;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden text-left group">
      {/* Optional Top Professional Photographic Image */}
      {showImage && (
        <div className="relative h-44 sm:h-48 w-full bg-[#093053] overflow-hidden">
          <Image
            src={meta.imageUrl}
            alt={service.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
          {/* Subtle brand overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(9, 48, 83, 0.65), rgba(9, 48, 83, 0.85))",
            }}
          />

          {/* Icon Badge Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-md">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg">
              {meta.label}
            </span>
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Header icon when image is disabled */}
          {!showImage && (
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#093053]/5 border border-[#093053]/10 flex items-center justify-center text-[#093053]">
                <IconComponent className="w-5 h-5" />
              </div>
              <Badge variant="neutral">{meta.label}</Badge>
            </div>
          )}

          {/* Service Title */}
          <h3 className="text-xl font-bold text-[#093053] tracking-tight mb-2.5 leading-snug group-hover:text-[#07243e] transition-colors">
            <Link href={`/services/${service.slug}`}>{service.title}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">
            {service.summary}
          </p>

          {/* Key Capabilities */}
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Key Capabilities:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              {capabilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card Footer: Learn More Link & Request Service CTA Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
          <Link
            href={`/services/${service.slug}`}
            className="text-xs font-bold text-[#093053] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Button
            href={`/contact?category=${service.category}&service=${service.slug}`}
            variant="primary"
            size="sm"
            className="font-bold bg-[#093053] text-white hover:bg-[#07243e] shadow-xs"
          >
            <span>Request This Service</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
