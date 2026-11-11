import React from "react";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await connectDB();

  // Seed default verified testimonials if none exist in DB
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.create([
      {
        quote:
          "When Ethio Telecom's fiber cut happened during peak evening checkout hours, our old system froze completely. Ariiti's offline POS never missed a single receipt. All 3 cashier terminals kept billing without a glitch, and everything synchronized automatically when the connection was restored.",
        clientType: "Commercial Supermarket & Retailer",
        clientName: "General Operations Director",
        location: "Harar Commercial Corridor",
        deploymentSummary: "Offline-First Ariiti POS + 3 Cashier Touch Terminals",
        verifiedTag: "Verified Commercial Deployment",
        rating: 5,
        isPublished: true,
        displayOrder: 1,
      },
      {
        quote:
          "We had persistent Wi-Fi dead spots across 3 floors and guest complaints every weekend. Ariiti Tech replaced the tangled wiring with certified Cat6 copper drops, a clean 12U server rack, and MikroTik VLAN routing. Our guest Wi-Fi and front-desk billing are now completely isolated and rock-solid.",
        clientType: "Hospitality & Commercial Complex",
        clientName: "Hotel General Manager",
        location: "Dire Dawa Commercial District",
        deploymentSummary: "Turnkey Cat6 Structured LAN & Dual-WAN Failover",
        verifiedTag: "Verified Infrastructure Deployment",
        rating: 5,
        isPublished: true,
        displayOrder: 2,
      },
      {
        quote:
          "Having full-time technical engineers stationed locally in Harar makes all the difference. When our main reception printer failed on a Saturday morning, their field technician was on-premise within 45 minutes with a spare replacement unit. The 2-hour SLA is real.",
        clientType: "Private Medical Diagnostic Clinic",
        clientName: "Clinical Director",
        location: "Harar, Eastern Ethiopia",
        deploymentSummary: "Preventive IT Maintenance Agreement & Emergency SLA",
        verifiedTag: "Verified SLA Maintenance Contract",
        rating: 5,
        isPublished: true,
        displayOrder: 3,
      },
    ]);
  }

  const rawTestimonials = await Testimonial.find()
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();

  const testimonials = rawTestimonials.map((t: any) => ({
    _id: t._id.toString(),
    quote: t.quote,
    clientType: t.clientType,
    clientName: t.clientName || "",
    location: t.location,
    deploymentSummary: t.deploymentSummary,
    verifiedTag: t.verifiedTag || "Verified Commercial Deployment",
    rating: t.rating || 5,
    isPublished: Boolean(t.isPublished),
    displayOrder: t.displayOrder || 0,
    createdAt: new Date(t.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Social Proof &amp; Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
          Client Feedback &amp; Verified Testimonials
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Manage authentic commercial reviews, deployment feedback, ratings, and live publication status on the public website.
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
