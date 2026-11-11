import React from "react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductLifecycleManager, {
  SerializedProduct,
} from "@/components/admin/ProductLifecycleManager";
import { Box } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await connectDB();

  const rawProducts = await Product.find().sort({ displayOrder: 1 }).lean();

  const products: SerializedProduct[] = rawProducts.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    status: p.status,
    accessOrDemoUrl: p.accessOrDemoUrl,
    targetCustomers: p.targetCustomers,
    mainFeatures: p.mainFeatures || [],
    isFeatured: p.isFeatured,
    featuresCount: p.mainFeatures?.length || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Box className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Product Portfolio Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
          Ariiti Software Ecosystem Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Control lifecycle progression from IN_DEVELOPMENT and TESTING to commercially AVAILABLE deployments with immediate on-demand ISR.
        </p>
      </div>

      <ProductLifecycleManager initialProducts={products} />
    </div>
  );
}
