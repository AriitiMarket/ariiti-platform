"use server";

import connectDB from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import Product from "@/models/Product";
import Service from "@/models/Service";
import Inquiry from "@/models/Inquiry";
import { auth } from "@/auth";

export async function globalAdminSearch(query: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  if (!query || query.trim().length < 2) {
    return { success: true, results: [] };
  }

  const q = query.trim();
  const regex = new RegExp(q, "i");

  try {
    await connectDB();

    const [inquiries, caseStudies, products, services] = await Promise.all([
      Inquiry.find({
        $or: [
          { referenceNumber: regex },
          { customerName: regex },
          { businessName: regex },
          { phone: regex },
        ],
      })
        .select("referenceNumber customerName status createdAt")
        .limit(5)
        .lean(),
      CaseStudy.find({ title: regex })
        .select("title slug publicationStatus")
        .limit(5)
        .lean(),
      Product.find({ name: regex })
        .select("name slug status")
        .limit(5)
        .lean(),
      Service.find({ title: regex })
        .select("title slug category isActive")
        .limit(5)
        .lean(),
    ]);

    const results = [
      ...inquiries.map((i: any) => ({
        type: "Inquiry",
        title: `${i.referenceNumber} - ${i.customerName}`,
        badge: i.status,
        href: `/admin/inquiries/${i._id}`,
      })),
      ...caseStudies.map((c: any) => ({
        type: "Case Study",
        title: c.title,
        badge: c.publicationStatus,
        href: `/admin/case-studies`,
      })),
      ...products.map((p: any) => ({
        type: "Product",
        title: p.name,
        badge: p.status,
        href: `/admin/products`,
      })),
      ...services.map((s: any) => ({
        type: "Service",
        title: s.title,
        badge: s.isActive ? "ACTIVE" : "INACTIVE",
        href: `/admin/services`,
      })),
    ];

    return { success: true, results };
  } catch (error: unknown) {
    console.error("[ERROR] globalAdminSearch failed:", error);
    return { success: false, error: "Search failed." };
  }
}
