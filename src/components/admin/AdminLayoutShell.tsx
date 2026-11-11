"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { UserRole } from "@/models/User";

interface AdminLayoutShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  };
  unreadInquiriesCount: number;
  children: React.ReactNode;
}

export const AdminLayoutShell: React.FC<AdminLayoutShellProps> = ({
  user,
  unreadInquiriesCount,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      <AdminSidebar
        role={user.role}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          user={user}
          unreadCount={unreadInquiriesCount}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900/50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutShell;
