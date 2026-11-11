import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import UserManager from "@/components/admin/UserManager";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  await connectDB();
  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();

  const users = rawUsers.map((u: any) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: Boolean(u.isActive),
    lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : undefined,
    createdAt: new Date(u.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Access Control & RBAC
          </span>
        </div>
        <h1 className="text-2xl font-black text-brand-primary tracking-tight">
          Administrator Accounts & Roles
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system administrators, assign granular roles (SUPER_ADMIN, CONTENT_MANAGER, OPERATIONS), and manage account activations.
        </p>
      </div>

      <UserManager initialUsers={users} currentUserId={session.user.id} />
    </div>
  );
}
