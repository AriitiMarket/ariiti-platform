import React from "react";
import Link from "next/link";
import { IProduct, ProductStatus } from "@/models/Product";
import Badge, { BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Check, ExternalLink, Layers, ArrowRight, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

const STATUS_META: Record<
  ProductStatus,
  { label: string; variant: BadgeVariant; helperText: string }
> = {
  AVAILABLE: {
    label: "Available",
    variant: "available",
    helperText: "Live commercial deployment ready",
  },
  TESTING: {
    label: "Beta Testing",
    variant: "testing",
    helperText: "Pilot testing with regional partners",
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    variant: "development",
    helperText: "Active engineering roadmap",
  },
  TEMPORARILY_UNAVAILABLE: {
    label: "Unavailable",
    variant: "unavailable",
    helperText: "Under maintenance or private revision",
  },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusInfo = STATUS_META[product.status] || {
    label: product.status,
    variant: "neutral",
    helperText: "",
  };

  const isLive = product.status === "AVAILABLE" && Boolean(product.accessOrDemoUrl);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-6 sm:p-7 relative text-left group">
      {/* Top Header & Lifecycle Badge */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-ariiti-navy flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-blue-950/10 group-hover:bg-ariiti-accent transition-colors">
            {product.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-ariiti-navy tracking-tight group-hover:text-ariiti-accent transition-colors">
              {product.name}
            </h3>
            <span className="text-[11px] text-slate-400 block font-medium">
              Ariiti Ecosystem Product
            </span>
          </div>
        </div>

        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      {/* Tagline */}
      <p className="text-sm font-semibold text-ariiti-accent mb-2.5">
        {product.tagline}
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
        {product.description}
      </p>

      {/* Target Customers */}
      {product.targetCustomers && (
        <div className="mb-4 bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 text-xs">
          <span className="font-bold text-slate-700 block mb-0.5">
            Target Deployment:
          </span>
          <span className="text-slate-600 line-clamp-2">
            {product.targetCustomers}
          </span>
        </div>
      )}

      {/* Main Features */}
      {product.mainFeatures && product.mainFeatures.length > 0 && (
        <div className="mb-6 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Key Architecture Features:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {product.mainFeatures.slice(0, 4).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Action Section with Contextual Lead Hook */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
        <span className="text-[11px] text-slate-400 font-medium">
          {statusInfo.helperText}
        </span>

        {isLive ? (
          <Button
            href={product.accessOrDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            className="w-full sm:w-auto font-bold"
          >
            <span>Launch Platform</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </Button>
        ) : (
          <Button
            href={`/contact?category=PRODUCT_INQUIRY&product=${product.slug}`}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto font-bold"
          >
            <span>Inquire on Product</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
