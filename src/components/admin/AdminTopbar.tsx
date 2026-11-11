"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LogOut,
  Search,
  ExternalLink,
  Menu,
  Bell,
  X,
  Loader2,
  FileCode,
  Box,
  Wrench,
  Inbox,
  User as UserIcon,
} from "lucide-react";
import { UserRole } from "@/models/User";
import { globalAdminSearch } from "@/actions/adminCmsActions";

interface AdminTopbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  };
  unreadCount?: number;
  onToggleMobileMenu?: () => void;
}

const ROLE_BADGES: Record<
  UserRole,
  { label: string; className: string }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  CONTENT_MANAGER: {
    label: "Content Manager",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  OPERATIONS: {
    label: "Operations",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
};

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  user,
  unreadCount = 0,
  onToggleMobileMenu,
}) => {
  const router = useRouter();
  const role = user?.role || "OPERATIONS";
  const roleMeta = ROLE_BADGES[role] || ROLE_BADGES.OPERATIONS;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await globalAdminSearch(searchQuery);
        if (res.success && res.results) {
          setSearchResults(res.results);
          setShowResults(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search results dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "Inquiry":
        return <Inbox className="w-3.5 h-3.5 text-blue-400" />;
      case "Case Study":
        return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case "Product":
        return <Box className="w-3.5 h-3.5 text-emerald-400" />;
      case "Service":
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Search className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0 gap-4">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Component */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              placeholder="Search inquiries, services, products, portfolio..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ariiti-accent focus:ring-1 focus:ring-ariiti-accent"
            />
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Search Dropdown Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80">
              <div className="px-3 py-1.5 bg-slate-900 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Matching Records ({searchResults.length})
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                      router.push(result.href);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-900/90 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {getResultIcon(result.type)}
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                          {result.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {result.type}
                        </p>
                      </div>
                    </div>
                    {result.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 ml-2">
                        {result.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Inquiries Notification */}
        <Link
          href="/admin/inquiries"
          className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={`${unreadCount} New Inquiries`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-black font-mono flex items-center justify-center text-white ring-2 ring-slate-900 animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/50"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-200 leading-tight">
              {user?.name || "Staff Member"}
            </p>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border font-mono inline-block mt-0.5 ${roleMeta.className}`}
            >
              {roleMeta.label}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-bold transition-all border border-slate-700/60"
            title="Sign out of administration session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
