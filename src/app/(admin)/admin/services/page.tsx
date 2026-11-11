import React from "react";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import ServicesManager from "@/components/admin/ServicesManager";
import { Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await connectDB();
  const rawServices = await Service.find().sort({ displayOrder: 1, createdAt: -1 }).lean();

  const services = rawServices.map((s: any) => ({
    _id: s._id.toString(),
    title: s.title,
    slug: s.slug,
    category: s.category,
    summary: s.summary,
    description: s.description,
    targetCustomers: s.targetCustomers,
    problemsSolved: s.problemsSolved || [],
    whatsIncluded: s.whatsIncluded || [],
    isActive: Boolean(s.isActive),
    displayOrder: s.displayOrder || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-ariiti-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            Catalog Management
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Enterprise Services Directory
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage the public catalog of software engineering, networking infrastructure, POS hardware, and SLA maintenance offerings.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
