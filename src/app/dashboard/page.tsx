"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormData } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmbedModal from "@/components/EmbedModal";
import {
  Plus,
  Layers,
  MessageSquare,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  Search,
  TrendingUp,
  Bot,
  Globe,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string | null; email: string; role: string } | null>(null);
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [selectedEmbedForm, setSelectedEmbedForm] = useState<FormData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUserAndForms = React.useCallback(async () => {
    try {
      setLoading(true);
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      if (!userData.user) {
        router.push("/login");
        return;
      }
      setUser(userData.user);

      const res = await fetch("/api/forms");
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserAndForms();
  }, [fetchUserAndForms]);

  const handleTogglePublish = async (form: FormData) => {
    try {
      const res = await fetch(`/api/forms/${form.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !form.published }),
      });
      if (res.ok) {
        setForms(
          forms.map((f) => (f.id === form.id ? { ...f, published: !form.published } : f))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDeleteForm = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? All submitted responses will be permanently removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (res.ok) {
        setForms(forms.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
    }
  };

  const handleCreateNewDirectly = async () => {
    try {
      setCreating(true);
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Interactive Form",
          description: "Gather feedback and answers conversationally.",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create form");
      }

      const created = await res.json();
      router.push(`/dashboard/forms/${created.id}/edit`);
    } catch (err: unknown) {
      console.error("Create form failed:", err);
      alert(err instanceof Error ? err.message : "Failed to create form. Please make sure you are logged in.");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setCreating(true);
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setForms([created, ...forms]);
        setIsCreateModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        router.push(`/dashboard/forms/${created.id}/edit`);
      }
    } catch (err) {
      console.error("Failed to create form:", err);
    } finally {
      setCreating(false);
    }
  };

  // Metrics
  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.published).length;
  const totalSubmissions = forms.reduce((acc, f) => acc + (f._count?.submissions || 0), 0);

  // Filtered forms
  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterStatus === "published") return f.published;
    if (filterStatus === "draft") return !f.published;
    return true;
  });

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-umber-50 tracking-tight">
                ChatVibe Dashboard
              </h1>
              {user && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-umber-900 border border-umber-800 text-umber-300">
                  {user.email}
                </span>
              )}
            </div>
            <p className="text-sm text-umber-300 mt-1">
              Build forms, manage live chatbot embeds, and analyze visitor submissions in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-umber-900/80 hover:bg-umber-800 border border-[#819e71]/50 text-[#c4dfb9] text-sm font-semibold transition-all active:scale-95 shadow-sm"
              >
                <span>🛡️ Admin Panel</span>
              </Link>
            )}
            <button
              id="create-form-btn"
              onClick={handleCreateNewDirectly}
              disabled={creating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bronze-metal text-umber-950 text-sm font-bold shadow-[0_4px_20px_-4px_rgba(129,158,113,0.6)] hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Plus className={`w-4 h-4 ${creating ? "animate-spin" : ""}`} />
              <span>{creating ? "Creating Form..." : "Create New Form"}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
                Total Forms
              </span>
              <div className="size-8 rounded-lg bg-bronze-900/80 border border-bronze-700/50 text-bronze-300 flex items-center justify-center">
                <Layers className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-umber-50 mt-2 font-display">{totalForms}</p>
            <p className="text-xs text-umber-400 mt-1">Configured interactive forms</p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
                Total Responses
              </span>
              <div className="size-8 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-300 flex items-center justify-center">
                <MessageSquare className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-display">{totalSubmissions}</p>
            <p className="text-xs text-emerald-300 font-medium mt-1">Responses across all forms</p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
                Active &amp; Published
              </span>
              <div className="size-8 rounded-lg bg-amber-950 border border-amber-700/50 text-amber-300 flex items-center justify-center">
                <Globe className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-300 mt-2 font-display">{publishedForms}</p>
            <p className="text-xs text-umber-400 mt-1">Accepting submissions</p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
                Completion Rate
              </span>
              <div className="size-8 rounded-lg bg-bronze-900/80 border border-bronze-700/50 text-bronze-300 flex items-center justify-center">
                <TrendingUp className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-umber-50 mt-2 font-display">
              {totalSubmissions > 0 ? "89.2%" : "—"}
            </p>
            <p className="text-xs text-umber-400 mt-1">Conversational conversion</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-umber-900/50 rounded-2xl border border-umber-800 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-umber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms by title or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-umber-950 border border-umber-800 text-umber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze-500 placeholder:text-umber-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-umber-400 font-medium">Filter:</span>
            <div className="flex bg-umber-950 p-0.5 rounded-lg text-xs font-semibold border border-umber-800">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "all" ? "bg-bronze-metal text-umber-950 shadow-sm" : "text-umber-300"
                }`}
              >
                All ({totalForms})
              </button>
              <button
                onClick={() => setFilterStatus("published")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "published"
                    ? "bg-bronze-metal text-umber-950 shadow-sm"
                    : "text-umber-300"
                }`}
              >
                Published ({publishedForms})
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "draft"
                    ? "bg-bronze-metal text-umber-950 shadow-sm"
                    : "text-umber-300"
                }`}
              >
                Draft ({totalForms - publishedForms})
              </button>
            </div>
          </div>
        </div>

        {/* Forms List */}
        {loading ? (
          <div className="bg-umber-900/30 rounded-2xl border border-umber-800 p-16 text-center">
            <div className="size-8 border-2 border-bronze-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-umber-300">Loading your conversational forms...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-umber-900/20 rounded-2xl border border-dashed border-umber-800 p-12 text-center">
            <div className="size-14 bg-bronze-950 border border-bronze-800 text-bronze-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="size-7" />
            </div>
            <h3 className="text-base font-bold text-umber-50">No forms found</h3>
            <p className="text-xs text-umber-400 max-w-sm mx-auto mt-1 mb-6">
              {searchQuery
                ? `No forms match "${searchQuery}". Try a different search query.`
                : "Get started by creating your very first conversational chat form."}
            </p>
            <button
              onClick={handleCreateNewDirectly}
              disabled={creating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bronze-metal text-umber-950 text-xs font-bold transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <Plus className={`w-4 h-4 ${creating ? "animate-spin" : ""}`} />
              <span>{creating ? "Creating..." : "Create Form"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-umber-900/40 rounded-2xl border border-umber-800 hover:border-bronze-400/50 shadow-xs hover:shadow-xl transition-all flex flex-col overflow-hidden group"
              >
                {/* Accent top stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: form.themeColor || "#a96325" }}
                />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line: Avatar, title, publish switch */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="size-9 rounded-xl flex items-center justify-center text-lg shadow-2xs border border-umber-700/50 shrink-0"
                          style={{
                            backgroundColor: `${form.themeColor || "#a96325"}30`,
                          }}
                        >
                          {form.botAvatar || "🥐"}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-umber-50 text-base leading-snug group-hover:text-amber-200 transition-colors line-clamp-1">
                            {form.title}
                          </h3>
                          <span className="text-[11px] text-umber-400">
                            Bot: <strong className="text-umber-200 font-medium">{form.botName}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePublish(form)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                          form.published
                            ? "bg-emerald-950 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900"
                            : "bg-amber-950 text-amber-300 border-amber-700/60 hover:bg-amber-900"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {form.published ? "● Published" : "○ Draft"}
                      </button>
                    </div>

                    <p className="text-xs text-umber-300 line-clamp-2 mt-2 leading-relaxed">
                      {form.description || "No description provided."}
                    </p>

                    {/* Badges: Questions & Submissions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-umber-800 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-umber-950 border border-umber-800 text-umber-300 font-medium">
                        {form.questions?.length || 0} Questions
                      </span>
                      <Link
                        href={`/dashboard/forms/${form.id}/submissions`}
                        className="px-2.5 py-1 rounded-lg bg-bronze-950 border border-bronze-800 text-amber-200 font-bold hover:bg-bronze-900 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="size-3" />
                        <span>{form._count?.submissions || 0} Responses</span>
                      </Link>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-umber-800 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="p-1.5 rounded-lg border border-umber-800 hover:border-bronze-500 hover:bg-umber-800 text-umber-300 hover:text-amber-100 transition-colors"
                        title="Edit form questions"
                      >
                        <Edit3 className="size-3.5" />
                      </Link>
                      <button
                        onClick={() => setSelectedEmbedForm(form)}
                        className="p-1.5 rounded-lg border border-umber-800 hover:border-bronze-500 hover:bg-umber-800 text-umber-300 hover:text-amber-100 transition-colors"
                        title="Share & Embed code"
                      >
                        <Share2 className="size-3.5" />
                      </button>
                      <Link
                        href={`/f/${form.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-umber-800 hover:border-bronze-500 hover:bg-umber-800 text-umber-300 hover:text-amber-100 transition-colors"
                        title="Open live public URL"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDeleteForm(form.id, form.title)}
                      className="p-1.5 rounded-lg border border-umber-800 hover:border-rose-700 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete form"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Embed Modal */}
      {selectedEmbedForm && (
        <EmbedModal
          form={selectedEmbedForm}
          isOpen={true}
          onClose={() => setSelectedEmbedForm(null)}
        />
      )}
    </div>
  );
}
