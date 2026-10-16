"use client";

import React, { useState } from "react";
import { FormData, QuestionData, QuestionType } from "@/types";
import ChatbotWidget from "@/components/ChatbotWidget";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  Settings,
  Eye,
  Type,
  Mail,
  ListOrdered,
  ToggleLeft,
  Share2,
  ExternalLink,
  Bot,
  Palette,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import EmbedModal from "@/components/EmbedModal";

interface FormBuilderProps {
  initialForm: FormData;
}

const PRESET_COLORS = [
  "#4f46e5", // Indigo
  "#059669", // Emerald
  "#0284c7", // Sky
  "#7c3aed", // Violet
  "#db2777", // Pink
  "#ea580c", // Orange
  "#0f172a", // Slate
];

const PRESET_AVATARS = ["🤖", "✨", "⚡", "💬", "💼", "👋", "🚀", "🌟"];

export default function FormBuilder({ initialForm }: FormBuilderProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [questions, setQuestions] = useState<QuestionData[]>(initialForm.questions || []);
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("questions");
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  // Add Question
  const addQuestion = (type: QuestionType = "text") => {
    const newQ: QuestionData = {
      id: `temp-${Date.now()}`,
      order: questions.length,
      type,
      title:
        type === "text"
          ? "What is your feedback?"
          : type === "email"
          ? "What is your email address?"
          : type === "multiple_choice"
          ? "Which option describes you best?"
          : "Are you satisfied with our service?",
      description: "",
      placeholder:
        type === "email" ? "name@example.com" : type === "text" ? "Type your answer here..." : "",
      required: true,
      options: type === "multiple_choice" ? ["Option 1", "Option 2", "Option 3"] : null,
    };
    setQuestions([...questions, newQ]);
    refreshPreview();
  };

  // Remove Question
  const deleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    refreshPreview();
  };

  // Move Question Up/Down
  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...questions];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    setQuestions(reordered);
    refreshPreview();
  };

  // Update specific question field
  const updateQuestion = (index: number, field: keyof QuestionData, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
    refreshPreview();
  };

  // Manage multiple choice options
  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const opts = q.options ? [...q.options] : [];
    opts.push(`Option ${opts.length + 1}`);
    updateQuestion(qIndex, "options", opts);
  };

  const updateOption = (qIndex: number, optIndex: number, val: string) => {
    const q = questions[qIndex];
    const opts = q.options ? [...q.options] : [];
    opts[optIndex] = val;
    updateQuestion(qIndex, "options", opts);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    const opts = (q.options ? [...q.options] : []).filter((_, i) => i !== optIndex);
    updateQuestion(qIndex, "options", opts);
  };

  // Refresh live chatbot preview
  const refreshPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  // Save changes to database
  const handleSave = async (publishedState?: boolean) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload = {
        ...form,
        published: publishedState !== undefined ? publishedState : form.published,
        questions: questions.map((q, idx) => ({
          ...q,
          order: idx,
        })),
      };

      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes.");
      }

      const updated = await res.json();
      setForm(updated);
      setQuestions(updated.questions || []);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      refreshPreview();
    } catch (err: any) {
      setSaveError(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublished = () => {
    const nextState = !form.published;
    setForm({ ...form, published: nextState });
    handleSave(nextState);
  };

  const previewFormObject: FormData = {
    ...form,
    questions,
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Top action bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {form.title}
              </span>
              <button
                onClick={togglePublished}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  form.published
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                }`}
                title="Click to toggle publish status"
              >
                {form.published ? "● Published" : "○ Draft"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share & Embed</span>
            </button>

            <Link
              href={`/dashboard/forms/${form.id}/submissions`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Submissions</span>
            </Link>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        </div>
      )}

      {/* Main Workspace: 2-Column Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Tabs (Questions vs Settings) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editor Tabs Navigation */}
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-2xs">
              <button
                onClick={() => setActiveTab("questions")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === "questions"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Questions ({questions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === "settings"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Bot & Form Settings</span>
              </button>
            </div>

            {/* TAB 1: Questions Editor */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300 relative group"
                  >
                    {/* Question Header & Order Controls */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <select
                          value={q.type}
                          onChange={(e) =>
                            updateQuestion(index, "type", e.target.value as QuestionType)
                          }
                          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="text">📝 Short Text</option>
                          <option value="email">✉️ Email Address</option>
                          <option value="multiple_choice">📋 Multiple Choice</option>
                          <option value="yes_no">👍 Yes / No</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveQuestion(index, "up")}
                          disabled={index === 0}
                          title="Move up"
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveQuestion(index, "down")}
                          disabled={index === questions.length - 1}
                          title="Move down"
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(index)}
                          title="Delete question"
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content Fields */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Question Prompt *
                        </label>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => updateQuestion(index, "title", e.target.value)}
                          placeholder="e.g. What is your full name?"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Helper Text or Subtitle (Optional)
                        </label>
                        <input
                          type="text"
                          value={q.description || ""}
                          onChange={(e) => updateQuestion(index, "description", e.target.value)}
                          placeholder="Additional context shown under the question bubble..."
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {(q.type === "text" || q.type === "email") && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Input Placeholder
                          </label>
                          <input
                            type="text"
                            value={q.placeholder || ""}
                            onChange={(e) => updateQuestion(index, "placeholder", e.target.value)}
                            placeholder={q.type === "email" ? "e.g. you@company.com" : "e.g. Type answer here..."}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* Multiple Choice Options Editor */}
                      {q.type === "multiple_choice" && (
                        <div className="pt-2">
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            Choice Options
                          </label>
                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-mono w-4">
                                  {optIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                  onClick={() => removeOption(index, optIdx)}
                                  disabled={(q.options || []).length <= 1}
                                  className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-20"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addOption(index)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add another choice option</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Required Question Switch */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <label className="text-xs font-semibold text-slate-600 cursor-pointer flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span>Required question (user must answer before continuing)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Question Button Strip */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-4 text-center">
                  <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                    Add New Question
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => addQuestion("text")}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      <Type className="w-3.5 h-3.5 text-indigo-500" />
                      <span>+ Short Text</span>
                    </button>
                    <button
                      onClick={() => addQuestion("email")}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-500" />
                      <span>+ Email</span>
                    </button>
                    <button
                      onClick={() => addQuestion("multiple_choice")}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-amber-500" />
                      <span>+ Multiple Choice</span>
                    </button>
                    <button
                      onClick={() => addQuestion("yes_no")}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      <ToggleLeft className="w-3.5 h-3.5 text-violet-500" />
                      <span>+ Yes / No</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bot & Form Settings */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-600" />
                    <span>General Form Information</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Basic details that appear on the form's header and dashboard.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Form Title
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Form Description
                      </label>
                      <textarea
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        placeholder="Explain what this form is for..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Chatbot Persona & Theme</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Customize your chatbot's avatar, bot name, and branding color.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bot Name
                        </label>
                        <input
                          type="text"
                          value={form.botName}
                          onChange={(e) => {
                            setForm({ ...form, botName: e.target.value });
                            refreshPreview();
                          }}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bot Avatar Emoji
                        </label>
                        <div className="flex items-center gap-1.5">
                          {PRESET_AVATARS.map((av) => (
                            <button
                              key={av}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, botAvatar: av });
                                refreshPreview();
                              }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                                form.botAvatar === av
                                  ? "border-indigo-500 bg-indigo-50 scale-105"
                                  : "border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Theme Brand Color</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {PRESET_COLORS.map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, themeColor: col });
                                refreshPreview();
                              }}
                              style={{ backgroundColor: col }}
                              className={`w-7 h-7 rounded-full transition-transform ${
                                form.themeColor === col
                                  ? "scale-110 ring-2 ring-offset-2 ring-indigo-500"
                                  : "hover:scale-105"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="color"
                            value={form.themeColor || "#4f46e5"}
                            onChange={(e) => {
                              setForm({ ...form, themeColor: e.target.value });
                              refreshPreview();
                            }}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200"
                          />
                          <span className="text-xs font-mono text-slate-500">{form.themeColor}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Welcome Message (Opening greeting)
                      </label>
                      <textarea
                        value={form.welcomeMessage}
                        onChange={(e) => {
                          setForm({ ...form, welcomeMessage: e.target.value });
                          refreshPreview();
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Completion Message (After answering all questions)
                      </label>
                      <textarea
                        value={form.completionMessage}
                        onChange={(e) => {
                          setForm({ ...form, completionMessage: e.target.value });
                          refreshPreview();
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-5 sticky top-36">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700">Live Interactive Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshPreview}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>Restart Test</span>
                  </button>
                  <a
                    href={`/f/${form.id}`}
                    target="_blank"
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Open standalone page in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="h-[580px] bg-slate-100 flex flex-col">
                <ChatbotWidget key={previewKey} form={previewFormObject} isPreview={true} />
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 mt-2">
              💡 Test questions in real-time. Submissions in preview mode won't pollute production data.
            </p>
          </div>
        </div>
      </div>

      <EmbedModal form={form} isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} />
    </div>
  );
}
