"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmbedModal from "@/components/EmbedModal";
import { FormData, SubmissionData } from "@/types";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  Download,
  Share2,
  Trash2,
  MessageSquare,
  ExternalLink,
  BarChart2,
  List,
  Search,
  RefreshCw,
} from "lucide-react";

export default function SubmissionsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [form, setForm] = useState<FormData | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "analytics">("table");

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [formRes, subRes] = await Promise.all([
        fetch(`/api/forms/${id}`),
        fetch(`/api/forms/${id}/submissions`),
      ]);

      if (formRes.ok) {
        const formData = await formRes.json();
        setForm(formData);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteSubmission = async (subId: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      const res = await fetch(`/api/forms/${id}/submissions/${subId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== subId));
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
    }
  };

  const exportCSV = () => {
    if (!form || submissions.length === 0) return;

    const questions = form.questions || [];
    const headers = ["Submission ID", "Timestamp", ...questions.map((q) => `"${q.title.replace(/"/g, '""')}"`)];

    const rows = submissions.map((sub) => {
      const answersMap: Record<string, string> = {};
      sub.answers.forEach((ans) => {
        answersMap[ans.questionId] = ans.value;
      });

      const questionValues = questions.map((q) => {
        const val = q.id ? answersMap[q.id] || "" : "";
        return `"${val.replace(/"/g, '""')}"`;
      });

      return [sub.id, `"${formatDate(sub.createdAt)}"`, ...questionValues].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${form.title.replace(/\s+/g, "_")}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (!form || submissions.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${form.title.replace(/\s+/g, "_")}_submissions.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchQuery) return true;
    return sub.answers.some((ans) =>
      ans.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-umber-400 mb-6">
          <Link href="/dashboard" className="hover:text-amber-100 transition-colors">
            ← Dashboard
          </Link>
          <span className="text-umber-700">/</span>
          <span className="text-umber-100 font-bold">{form?.title || "Form"}</span>
          <span className="text-umber-700">/</span>
          <span className="text-amber-300">Responses</span>
        </div>

        {/* Page Header */}
        <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-amber-500/20"
              style={{ backgroundColor: `${form?.themeColor || "#a96325"}30` }}
            >
              {form?.botAvatar || "🥐"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-umber-50">
                  {form?.title || "Form Responses"}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    form?.published
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {form?.published ? "● Published" : "○ Draft"}
                </span>
              </div>
              <p className="text-xs text-umber-300 mt-1 line-clamp-1">
                {form?.description || "Showing all submitted answers."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="p-2 border border-umber-800 hover:bg-umber-800 text-umber-300 hover:text-amber-100 rounded-xl transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw className="size-4" />
            </button>
            <button
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-umber-800 bg-umber-900/60 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Share2 className="size-3.5 text-bronze-400" />
              <span>Share &amp; Embed</span>
            </button>
            <Link
              href={`/dashboard/forms/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-umber-800 bg-umber-900/60 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Edit Form</span>
            </Link>
            <Link
              href={`/f/${id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-bronze-metal text-umber-950 text-xs font-bold transition-all shadow-md hover:brightness-110 active:scale-95"
            >
              <span>Test Live Form</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
              Total Submissions
            </span>
            <p className="font-display text-3xl font-extrabold text-umber-50 mt-2">{submissions.length}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              {submissions.length > 0 ? "Actively receiving answers" : "Waiting for first submission"}
            </p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
              Latest Submission
            </span>
            <p className="font-display text-lg font-bold text-amber-200 mt-2 truncate">
              {submissions.length > 0 ? timeAgo(submissions[0].createdAt) : "—"}
            </p>
            <p className="text-xs text-umber-400 mt-1">
              {submissions.length > 0 ? formatDate(submissions[0].createdAt) : "No submissions yet"}
            </p>
          </div>

          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs">
            <span className="text-xs font-bold text-umber-400 uppercase tracking-wider">
              Questions in Form
            </span>
            <p className="font-display text-3xl font-extrabold text-umber-50 mt-2">
              {form?.questions?.length || 0}
            </p>
            <p className="text-xs text-umber-400 mt-1">Conversational question steps</p>
          </div>
        </div>

        {/* View Toggle & Action Strip */}
        <div className="bg-umber-900/50 rounded-2xl border border-umber-800 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex bg-umber-950 p-1 rounded-xl text-xs font-bold border border-umber-800">
              <button
                onClick={() => setActiveView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === "table"
                    ? "bg-bronze-metal text-umber-950 shadow-xs"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                <List className="size-3.5" />
                <span>Responses Table</span>
              </button>
              <button
                onClick={() => setActiveView("analytics")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === "analytics"
                    ? "bg-bronze-metal text-umber-950 shadow-xs"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                <BarChart2 className="size-3.5" />
                <span>Question Breakdown</span>
              </button>
            </div>

            {activeView === "table" && (
              <div className="relative flex-1 sm:w-64">
                <Search className="size-3.5 text-umber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search answers..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-umber-950 border border-umber-800 text-umber-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-bronze-500 placeholder:text-umber-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={exportCSV}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-umber-800 bg-umber-900/70 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <Download className="size-3.5 text-bronze-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportJSON}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-umber-800 bg-umber-900/70 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <Download className="size-3.5 text-bronze-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="bg-umber-900/30 rounded-2xl border border-umber-800 p-16 text-center">
            <div className="size-8 border-2 border-bronze-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-umber-300">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-umber-900/20 rounded-2xl border border-dashed border-umber-800 p-12 text-center">
            <div className="size-12 bg-bronze-950 border border-bronze-800 text-bronze-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="text-base font-bold text-umber-50">No responses recorded yet</h3>
            <p className="text-xs text-umber-400 max-w-sm mx-auto mt-1 mb-6">
              Share your form link or embed the widget on your website to start collecting responses!
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href={`/f/${id}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bronze-metal text-umber-950 text-xs font-bold transition-all shadow-md hover:brightness-110 active:scale-95"
              >
                <span>Submit a Test Response →</span>
              </Link>
            </div>
          </div>
        ) : activeView === "table" ? (
          /* Table View */
          <div className="bg-umber-900/40 rounded-2xl border border-umber-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-umber-950 border-b border-umber-800 text-umber-300 font-bold">
                    <th className="py-3.5 px-4 w-44">Timestamp</th>
                    {(form?.questions || []).map((q) => (
                      <th key={q.id} className="py-3.5 px-4 min-w-[200px] max-w-xs truncate">
                        {q.title}
                      </th>
                    ))}
                    <th className="py-3.5 px-4 text-right w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-umber-800/60">
                  {filteredSubmissions.map((sub) => {
                    const answersMap: Record<string, string> = {};
                    sub.answers.forEach((ans) => {
                      answersMap[ans.questionId] = ans.value;
                    });

                    return (
                      <tr key={sub.id} className="hover:bg-umber-900/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-amber-200 whitespace-nowrap">
                          <div>{formatDate(sub.createdAt)}</div>
                          <div className="text-[10px] text-umber-400">{timeAgo(sub.createdAt)}</div>
                        </td>
                        {(form?.questions || []).map((q) => {
                          const val = q.id ? answersMap[q.id] : "";
                          return (
                            <td key={q.id} className="py-3.5 px-4 text-umber-100">
                              {val ? (
                                q.type === "yes_no" ? (
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                      val.toLowerCase() === "yes"
                                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                        : "bg-rose-950 text-rose-300 border border-rose-800"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                ) : (
                                  <span className="line-clamp-2">{val}</span>
                                )
                              ) : (
                                <span className="text-umber-600 italic">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 text-umber-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete this submission"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Question Analytics Breakdown View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(form?.questions || []).map((q, idx) => {
              // Calculate answer frequencies
              const allAnswers = submissions
                .map((s) => s.answers.find((a) => a.questionId === q.id)?.value)
                .filter(Boolean) as string[];

              const countMap: Record<string, number> = {};
              allAnswers.forEach((val) => {
                countMap[val] = (countMap[val] || 0) + 1;
              });

              return (
                <div
                  key={q.id || idx}
                  className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-bronze-400 uppercase tracking-wider">
                      Question {idx + 1} • {q.type.replace("_", " ")}
                    </span>
                    <span className="text-xs font-semibold text-umber-400">
                      {allAnswers.length} responses
                    </span>
                  </div>

                  <h3 className="font-bold text-umber-50 text-sm mb-4">{q.title}</h3>

                  {q.type === "multiple_choice" || q.type === "yes_no" ? (
                    <div className="space-y-3">
                      {(q.options || (q.type === "yes_no" ? ["Yes", "No"] : [])).map((opt) => {
                        const count = countMap[opt] || 0;
                        const pct = allAnswers.length > 0 ? Math.round((count / allAnswers.length) * 100) : 0;
                        return (
                          <div key={opt} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-umber-200">
                              <span>{opt}</span>
                              <span className="font-bold text-amber-200">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-umber-950 rounded-full h-2.5 overflow-hidden border border-umber-800">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: form?.themeColor || "#cb7d2e",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {allAnswers.length === 0 ? (
                        <p className="text-xs text-umber-500 italic">No answers recorded yet.</p>
                      ) : (
                        allAnswers.slice(0, 10).map((ans, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-umber-950/70 border border-umber-800 text-xs text-amber-100"
                          >
                            &ldquo;{ans}&rdquo;
                          </div>
                        ))
                      )}
                      {allAnswers.length > 10 && (
                        <p className="text-[11px] text-umber-400 text-center">
                          + {allAnswers.length - 10} more answers (view in Table tab)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {form && (
        <EmbedModal
          form={form}
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
