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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-slate-800 transition-colors">
            ← Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{form?.title || "Form"}</span>
          <span className="text-slate-300">/</span>
          <span>Responses</span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100"
              style={{ backgroundColor: `${form?.themeColor || "#4f46e5"}15` }}
            >
              {form?.botAvatar || "🤖"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {form?.title || "Form Responses"}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    form?.published
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {form?.published ? "● Published" : "○ Draft"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {form?.description || "Showing all submitted answers."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share & Embed</span>
            </button>
            <Link
              href={`/dashboard/forms/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Edit Form</span>
            </Link>
            <Link
              href={`/f/${id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Test Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{submissions.length}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {submissions.length > 0 ? "Actively receiving answers" : "Waiting for first submission"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Latest Submission
            </span>
            <p className="text-lg font-bold text-slate-900 mt-2 truncate">
              {submissions.length > 0 ? timeAgo(submissions[0].createdAt) : "—"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {submissions.length > 0 ? formatDate(submissions[0].createdAt) : "No submissions yet"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Questions in Form
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {form?.questions?.length || 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">Conversational question steps</p>
          </div>
        </div>

        {/* View Toggle & Action Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Responses Table</span>
              </button>
              <button
                onClick={() => setActiveView("analytics")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === "analytics"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Question Breakdown</span>
              </button>
            </div>

            {activeView === "table" && (
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search answers..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={exportCSV}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportJSON}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No responses recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Share your form link or embed the widget on your website to start collecting responses!
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href={`/f/${id}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Submit a Test Response →</span>
              </Link>
            </div>
          </div>
        ) : activeView === "table" ? (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-4 w-44">Timestamp</th>
                    {(form?.questions || []).map((q) => (
                      <th key={q.id} className="py-3 px-4 min-w-[200px] max-w-xs truncate">
                        {q.title}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => {
                    const answersMap: Record<string, string> = {};
                    sub.answers.forEach((ans) => {
                      answersMap[ans.questionId] = ans.value;
                    });

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                          <div>{formatDate(sub.createdAt)}</div>
                          <div className="text-[10px] text-slate-400">{timeAgo(sub.createdAt)}</div>
                        </td>
                        {(form?.questions || []).map((q) => {
                          const val = q.id ? answersMap[q.id] : "";
                          return (
                            <td key={q.id} className="py-3.5 px-4 text-slate-800">
                              {val ? (
                                q.type === "yes_no" ? (
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                      val.toLowerCase() === "yes"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-rose-50 text-rose-700 border border-rose-200"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                ) : (
                                  <span className="line-clamp-2">{val}</span>
                                )
                              ) : (
                                <span className="text-slate-300 italic">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete this submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question {idx + 1} • {q.type.replace("_", " ")}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {allAnswers.length} responses
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-4">{q.title}</h3>

                  {q.type === "multiple_choice" || q.type === "yes_no" ? (
                    <div className="space-y-3">
                      {(q.options || (q.type === "yes_no" ? ["Yes", "No"] : [])).map((opt) => {
                        const count = countMap[opt] || 0;
                        const pct = allAnswers.length > 0 ? Math.round((count / allAnswers.length) * 100) : 0;
                        return (
                          <div key={opt} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700">
                              <span>{opt}</span>
                              <span className="font-bold text-slate-900">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: form?.themeColor || "#4f46e5",
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
                        <p className="text-xs text-slate-400 italic">No answers recorded yet.</p>
                      ) : (
                        allAnswers.slice(0, 10).map((ans, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                          >
                            &ldquo;{ans}&rdquo;
                          </div>
                        ))
                      )}
                      {allAnswers.length > 10 && (
                        <p className="text-[11px] text-slate-400 text-center">
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
