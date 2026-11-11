import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  await connectDB();
  const unreadCount = await Inquiry.countDocuments({ status: "NEW" });

  return (
    <AdminLayoutShell
      user={session.user}
      unreadInquiriesCount={unreadCount}
    >
      {children}
    </AdminLayoutShell>
  );
}
