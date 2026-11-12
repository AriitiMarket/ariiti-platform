"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  Search,
  KeyRound,
  Mail,
  Shield,
} from "lucide-react";
import { UserRole } from "@/models/User";
import {
  createAdminUser,
  toggleUserStatus,
  updateUserRole,
} from "@/actions/admin/users";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface UserManagerProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
  CONTENT_MANAGER: "bg-slate-100 text-slate-700 border-slate-200",
  OPERATIONS: "bg-slate-100 text-slate-700 border-slate-200",
};

export const UserManager: React.FC<UserManagerProps> = ({
  initialUsers,
  currentUserId,
}) => {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "OPERATIONS" as UserRole,
  });

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "OPERATIONS",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await createAdminUser(formData);
      if (res.success && res.user) {
        const newUser: UserItem = {
          _id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [newUser, ...prev]);
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Failed to create user.");
      }
    } catch (err: unknown) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    if (user._id === currentUserId) {
      alert("You cannot deactivate your own active session.");
      return;
    }
    const newStatus = !user.isActive;
    const res = await toggleUserStatus(user._id, newStatus);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: newStatus } : u))
      );
    } else {
      alert(res.error || "Failed to update status.");
    }
  };

  const handleRoleChange = async (user: UserItem, newRole: UserRole) => {
    if (user._id === currentUserId && newRole !== "SUPER_ADMIN") {
      alert("You cannot demote your own Super Admin privileges.");
      return;
    }
    const res = await updateUserRole(user._id, newRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } else {
      alert(res.error || "Failed to update role.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search administrators by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 font-bold">Name & Email</th>
                <th className="py-3 px-4 font-bold">Assigned Role</th>
                <th className="py-3 px-4 text-center font-bold">Account Status</th>
                <th className="py-3 px-4 text-center font-bold">Last Login</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No administrators found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{u.name}</span>
                        {u._id === currentUserId && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-brand-primary/10 text-brand-primary rounded border border-brand-primary/20">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {u.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u, e.target.value as UserRole)
                        }
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none ${ROLE_COLORS[u.role]} bg-white`}
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                        <option value="OPERATIONS">OPERATIONS</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u._id === currentUserId}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        } disabled:opacity-50`}
                      >
                        {u.isActive ? (
                          <>
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 text-rose-600" />
                            <span>SUSPENDED</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              <span>Create Administrator Account</span>
            </h3>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Full Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Dawit Haile"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="dawit@ariititech.com"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Initial Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Role & Permissions *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, role: e.target.value as UserRole }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="OPERATIONS">OPERATIONS (Manage Leads, Field Status)</option>
                  <option value="CONTENT_MANAGER">CONTENT_MANAGER (Case Studies, Articles, Catalog)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform Access & RBAC)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
