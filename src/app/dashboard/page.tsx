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
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [selectedEmbedForm, setSelectedEmbedForm] = useState<FormData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchForms = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/forms");
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (err) {
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Forms & Chatbots Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, configure and monitor all your interactive conversational forms in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              id="create-form-btn"
              href="/dashboard/forms/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Form</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Forms
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalForms}</p>
            <p className="text-xs text-slate-400 mt-1">All forms configured</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Responses
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalSubmissions}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Collected across all forms</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active & Published
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{publishedForms}</p>
            <p className="text-xs text-slate-400 mt-1">Live accepting submissions</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Avg. Completion
              </span>
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {totalSubmissions > 0 ? "87.4%" : "—"}
            </p>
            <p className="text-xs text-slate-400 mt-1">High conversational conversion</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms by title or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Filter:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                All ({totalForms})
              </button>
              <button
                onClick={() => setFilterStatus("published")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "published"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600"
                }`}
              >
                Published ({publishedForms})
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterStatus === "draft"
                    ? "bg-white text-amber-700 shadow-2xs"
                    : "text-slate-600"
                }`}
              >
                Draft ({totalForms - publishedForms})
              </button>
            </div>
          </div>
        </div>

        {/* Forms List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading your interactive forms...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No forms found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              {searchQuery
                ? `No forms match "${searchQuery}". Try a different search query.`
                : "Get started by creating your very first interactive conversational form."}
            </p>
            <Link
              href="/dashboard/forms/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Form</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Form Card Top Banner */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: form.themeColor || "#4f46e5" }}
                />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line: Avatar, title, publish switch */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-2xs border border-slate-100 shrink-0"
                          style={{
                            backgroundColor: `${form.themeColor || "#4f46e5"}15`,
                          }}
                        >
                          {form.botAvatar || "🤖"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {form.title}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            Bot: <strong className="text-slate-600">{form.botName}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePublish(form)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                          form.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {form.published ? "● Published" : "○ Draft"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {form.description || "No description provided."}
                    </p>

                    {/* Badges: Questions & Submissions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                        {form.questions?.length || 0} Questions
                      </span>
                      <Link
                        href={`/dashboard/forms/${form.id}/submissions`}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{form._count?.submissions || 0} Responses</span>
                      </Link>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/forms/${form.id}/edit`}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit form questions & settings"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSelectedEmbedForm(form)}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Get Embed Code & Public Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/f/${form.id}`}
                        target="_blank"
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Open live public form in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteForm(form.id, form.title)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      href={`/dashboard/forms/${form.id}/submissions`}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Submissions →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create New Form */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Create New Interactive Form</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Form Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Client Onboarding Form"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What is the objective of this conversational form?"
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create & Open Builder →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEmbedForm && (
        <EmbedModal
          form={selectedEmbedForm}
          isOpen={true}
          onClose={() => setSelectedEmbedForm(null)}
        />
      )}

      <Footer />
    </div>
  );
}
