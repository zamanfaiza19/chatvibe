"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FormData } from "@/types";
import {
  Shield,
  Users,
  Layers,
  Trash2,
  ExternalLink,
  Edit3,
  Search,
  Plus,
  Ban,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  _count: {
    forms: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"forms" | "users">("forms");
  const [forms, setForms] = useState<FormData[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Authenticate and verify admin role
  const checkAdminAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!data.user || data.user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setCurrentUser(data.user);

      // Fetch all forms and all users
      const [formsRes, usersRes] = await Promise.all([
        fetch("/api/forms?scope=all"),
        fetch("/api/admin/users"),
      ]);

      if (formsRes.ok) {
        const formsData = await formsRes.json();
        setForms(formsData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error("Admin page load error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Admin delete form
  const handleDeleteForm = async (id: string, title: string) => {
    if (!confirm(`ADMIN ACTION: Are you sure you want to permanently delete form "${title}"?`)) {
      return;
    }
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete form.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Admin toggle user suspension
  const handleToggleSuspend = async (user: AdminUser) => {
    const actionText = user.isSuspended ? "unsuspend" : "suspend";
    if (!confirm(`Are you sure you want to ${actionText} user ${user.email}?`)) {
      return;
    }
    try {
      setActionLoadingId(user.id);
      const res = await fetch(`/api/admin/users/${user.id}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !user.isSuspended }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isSuspended: updated.isSuspended } : u))
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to update suspension status.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    ((f as any).user?.email && (f as any).user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs text-umber-400 hover:text-amber-200 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to My Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-bronze-metal flex items-center justify-center text-umber-950 shadow-md">
                <Shield className="size-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-umber-50 tracking-tight">
                  Admin Command Center
                </h1>
                <p className="text-sm text-umber-300">
                  Global supervision: manage all user accounts, forms, and enforce moderation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/forms/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bronze-metal text-umber-950 text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="size-4" />
              <span>Create Global Form</span>
            </Link>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">Total Users</span>
              <Users className="size-4 text-[#819e71]" />
            </div>
            <p className="text-3xl font-bold font-display text-umber-50 mt-2">{users.length}</p>
            <p className="text-xs text-umber-400 mt-1">
              {users.filter((u) => u.isSuspended).length} suspended accounts
            </p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">All System Forms</span>
              <Layers className="size-4 text-[#c4dfb9]" />
            </div>
            <p className="text-3xl font-bold font-display text-umber-50 mt-2">{forms.length}</p>
            <p className="text-xs text-umber-400 mt-1">
              {forms.filter((f) => f.published).length} actively published
            </p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">Total Submissions</span>
              <CheckCircle className="size-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-display text-umber-50 mt-2">
              {forms.reduce((acc, f) => acc + (f._count?.submissions || 0), 0)}
            </p>
            <p className="text-xs text-umber-400 mt-1">Across all registered forms</p>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-umber-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("forms")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "forms"
                  ? "bg-bronze-metal text-umber-950 shadow-sm"
                  : "bg-umber-900/50 text-umber-300 hover:text-white"
              }`}
            >
              <Layers className="size-4" />
              <span>All Forms ({forms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-bronze-metal text-umber-950 shadow-sm"
                  : "bg-umber-900/50 text-umber-300 hover:text-white"
              }`}
            >
              <Users className="size-4" />
              <span>User Accounts ({users.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-umber-400" />
            <input
              type="text"
              placeholder={activeTab === "forms" ? "Search forms or owner..." : "Search user accounts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-umber-900/50 border border-umber-800 rounded-xl text-xs text-umber-100 placeholder:text-umber-500 focus:outline-none focus:ring-1 focus:ring-[#819e71] transition-all"
            />
          </div>
        </div>

        {/* TAB 1: ALL FORMS */}
        {activeTab === "forms" && (
          <div>
            {loading ? (
              <div className="bg-umber-900/30 rounded-2xl border border-umber-800 p-16 text-center">
                <div className="size-8 border-2 border-bronze-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-umber-300">Loading system forms...</p>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="bg-umber-900/20 rounded-2xl border border-dashed border-umber-800 p-12 text-center">
                <p className="text-sm text-umber-400">No forms found matching search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredForms.map((form) => (
                  <div
                    key={form.id}
                    className="bg-umber-900/40 rounded-2xl border border-umber-800 hover:border-bronze-500/50 transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: form.themeColor || "#819e71" }} />
                          <h3 className="font-bold text-base text-umber-50 truncate" title={form.title}>
                            {form.title}
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                            form.published
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/80"
                              : "bg-umber-950 text-umber-400 border border-umber-800"
                          }`}
                        >
                          {form.published ? "Live" : "Draft"}
                        </span>
                      </div>

                      <p className="text-xs text-umber-300 line-clamp-2 mb-3">
                        {form.description || "No description provided."}
                      </p>

                      <div className="text-[11px] text-umber-400 space-y-1 mb-4 pb-3 border-b border-umber-800/60">
                        <div>
                          Owner: <span className="text-umber-200 font-semibold">{(form as any).user?.email || "Unassigned"}</span>
                        </div>
                        <div>
                          Responses: <span className="text-[#c4dfb9] font-bold">{form._count?.submissions || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/forms/${form.id}/edit`}
                          className="p-1.5 rounded-lg bg-umber-900 hover:bg-umber-800 text-umber-300 hover:text-white transition-colors"
                          title="Edit Form"
                        >
                          <Edit3 className="size-3.5" />
                        </Link>
                        <Link
                          href={`/f/${form.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-umber-900 hover:bg-umber-800 text-umber-300 hover:text-white transition-colors"
                          title="View Public Form"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                      </div>

                      <button
                        onClick={() => handleDeleteForm(form.id, form.title)}
                        disabled={actionLoadingId === form.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 font-semibold text-xs transition-colors"
                      >
                        <Trash2 className="size-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USERS & SUSPENSION */}
        {activeTab === "users" && (
          <div className="bg-umber-900/30 rounded-2xl border border-umber-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-umber-300">
                <thead className="bg-umber-950 text-umber-400 font-bold uppercase tracking-wider border-b border-umber-800">
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Forms Created</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-umber-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-umber-900/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-umber-50">{u.name || "Anonymous User"}</div>
                        <div className="text-[11px] text-umber-400">{u.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            u.role === "admin"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-umber-950 text-umber-400 border border-umber-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-umber-100">{u._count?.forms || 0}</td>
                      <td className="px-5 py-4">
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                            <Ban className="size-3" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <CheckCircle className="size-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-umber-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {u.id === currentUser?.id ? (
                          <span className="text-[11px] text-umber-500 italic">Current Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleSuspend(u)}
                            disabled={actionLoadingId === u.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm ${
                              u.isSuspended
                                ? "bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200"
                                : "bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200"
                            }`}
                          >
                            {u.isSuspended ? (
                              <>
                                <CheckCircle className="size-3" />
                                <span>Unsuspend User</span>
                              </>
                            ) : (
                              <>
                                <Ban className="size-3" />
                                <span>Suspend User</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
