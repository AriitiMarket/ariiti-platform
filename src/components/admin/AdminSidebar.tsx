"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Palette,
  Users,
  Wrench,
  Box,
  FileCode,
  FileText,
  MessageSquare,
  Inbox,
  Settings,
  ShieldCheck,
  History,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { UserRole } from "@/models/User";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  role?: UserRole;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    requiredRole?: UserRole;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  role = "OPERATIONS",
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navigationSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      title: "COMPANY & BRAND",
      items: [
        {
          name: "Organization Profile",
          href: "/admin/company",
          icon: Building2,
        },
        {
          name: "Branding & Identity",
          href: "/admin/branding",
          icon: Palette,
        },
        {
          name: "Team Capabilities",
          href: "/admin/team",
          icon: Users,
        },
      ],
    },
    {
      title: "WEBSITE CONTENT",
      items: [
        {
          name: "Services",
          href: "/admin/services",
          icon: Wrench,
        },
        {
          name: "Products",
          href: "/admin/products",
          icon: Box,
        },
        {
          name: "Portfolio Projects",
          href: "/admin/case-studies",
          icon: FileCode,
        },
        {
          name: "Blog & News",
          href: "/admin/articles",
          icon: FileText,
        },
        {
          name: "Testimonials",
          href: "/admin/testimonials",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "CUSTOMER COMMUNICATION",
      items: [
        {
          name: "Service Inquiries",
          href: "/admin/inquiries",
          icon: Inbox,
        },
      ],
    },
    {
      title: "CONFIGURATION",
      items: [
        {
          name: "Website Settings",
          href: "/admin/settings",
          icon: Settings,
          requiredRole: "SUPER_ADMIN",
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          name: "Admin Users",
          href: "/admin/users",
          icon: ShieldCheck,
          requiredRole: "SUPER_ADMIN",
        },
        {
          name: "Activity Logs",
          href: "/admin/activity-logs",
          icon: History,
        },
      ],
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ariiti-navy border border-blue-500/30 flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="font-black text-base text-blue-400">A</span>
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block">
              ARIITI TECH
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block -mt-0.5">
              Admin Platform
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="p-3 space-y-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {navigationSections.map((section) => {
          // Filter items by role
          const visibleItems = section.items.filter(
            (item) => !item.requiredRole || item.requiredRole === role
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {visibleItems.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group",
                        active
                          ? "bg-ariiti-accent text-white shadow-sm font-bold"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            active
                              ? "text-white"
                              : "text-slate-400 group-hover:text-slate-200"
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Live Website Shortcut */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <span className="font-medium text-[11px]">View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
