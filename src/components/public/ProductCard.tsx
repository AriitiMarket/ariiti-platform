import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IProduct, ProductStatus } from "@/models/Product";
import Badge, { BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Check, ArrowRight, ExternalLink, Box } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

const STATUS_META: Record<
  string,
  { label: string; variant: BadgeVariant; helperText: string }
> = {
  AVAILABLE: {
    label: "Available",
    variant: "available",
    helperText: "Production ready for commercial deployment",
  },
  TESTING: {
    label: "Testing",
    variant: "testing",
    helperText: "Pilot testing in active partner environments",
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    variant: "development",
    helperText: "Engineering roadmap under active development",
  },
  TEMPORARILY_UNAVAILABLE: {
    label: "Temporarily Unavailable",
    variant: "unavailable",
    helperText: "Maintenance revision in progress",
  },
  DISCONTINUED: {
    label: "Discontinued",
    variant: "neutral",
    helperText: "Archived release",
  },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusInfo = STATUS_META[product.status] || {
    label: product.status.replace(/_/g, " "),
    variant: "neutral",
    helperText: "",
  };

  const hasLiveDemo = Boolean(product.accessOrDemoUrl);
  const screenshot =
    product.screenshots && product.screenshots.length > 0
      ? product.screenshots[0]
      : null;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden text-left group">
      {/* Product Visual Header (Screenshot or Logo Banner) */}
      <div className="relative h-44 sm:h-48 w-full bg-[#093053] overflow-hidden flex items-center justify-center">
        {screenshot ? (
          <Image
            src={screenshot}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2 shadow-md">
              <Box className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/80 font-mono text-xs uppercase tracking-wider font-semibold">
              Ariiti Product
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(9, 48, 83, 0.4), rgba(9, 48, 83, 0.85))",
          }}
        />

        {/* Status Badge in Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <Badge variant={statusInfo.variant} withDot={true}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Category Pill in Top Left */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md">
            Business Technology
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="text-xl font-bold text-[#093053] tracking-tight mb-1.5 leading-snug group-hover:text-[#07243e] transition-colors">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Tagline */}
          <p className="text-xs font-semibold text-[#093053]/80 mb-3">
            {product.tagline}
          </p>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">
            {product.description}
          </p>

          {/* Key Features */}
          {product.mainFeatures && product.mainFeatures.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Features:
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
        </div>

        {/* Card Footer: View Details Link & Request a Demo CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-bold text-[#093053] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {hasLiveDemo ? (
              <Button
                href={product.accessOrDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                className="font-bold bg-[#093053] text-white hover:bg-[#07243e] shadow-xs"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                href={`/contact?category=PRODUCT_INQUIRY&product=${product.slug}`}
                variant="primary"
                size="sm"
                className="font-bold bg-[#093053] text-white hover:bg-[#07243e] shadow-xs"
              >
                <span>Request a Demo</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
