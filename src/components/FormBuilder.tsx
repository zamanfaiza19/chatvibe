"use client";

import React, { useState, useRef } from "react";
import { FormData, QuestionData, QuestionType } from "@/types";
import ChatbotWidget from "@/components/ChatbotWidget";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Layers,
  Settings,
  Type,
  Mail,
  ListOrdered,
  ToggleLeft,
  Share2,
  ExternalLink,
  Bot,
  Palette,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import EmbedModal from "@/components/EmbedModal";

interface FormBuilderProps {
  initialForm: FormData;
}

const PRESET_COLORS = [
  "#819e71", // Sage Green (ChatVibe Swatch)
  "#c4dfb9", // Pistachio Green (ChatVibe Swatch)
  "#6d9a5e", // Forest Green
  "#4d673f", // Deep Moss
  "#059669", // Emerald
  "#0284c7", // Sky
  "#7c3aed", // Violet
  "#cb7d2e", // Warm Gold
];

const PRESET_AVATARS = ["🥐", "💬", "🤖", "✨", "⚡", "💼", "👋", "🌟"];

export default function FormBuilder({ initialForm }: FormBuilderProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [questions, setQuestions] = useState<QuestionData[]>(initialForm.questions || []);
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("questions");
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const newQIdRef = useRef<number>(1);

  // Add Question
  const addQuestion = (type: QuestionType = "text") => {
    const newQ: QuestionData = {
      id: `temp-${newQIdRef.current++}`,
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
  const updateQuestion = <K extends keyof QuestionData>(
    index: number,
    field: K,
    value: QuestionData[K]
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while saving.";
      setSaveError(msg);
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
    <div className="min-h-screen bg-umber-950 text-umber-50 pb-20 font-sans">
      {/* Top action bar */}
      <div className="bg-umber-900/90 border-b border-umber-800 sticky top-16 z-30 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-umber-400 hover:text-amber-100 transition-colors"
            >
              ← Dashboard
            </Link>
            <span className="text-umber-700">/</span>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold font-display text-umber-100 truncate max-w-xs sm:max-w-md">
                {form.title}
              </span>
              <button
                onClick={togglePublished}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  form.published
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900"
                    : "bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-umber-800 bg-umber-900/60 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-bronze-400" />
              <span>Share & Embed</span>
            </button>

            <Link
              href={`/dashboard/forms/${form.id}/submissions`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-umber-800 bg-umber-900/60 hover:bg-umber-800 text-umber-200 hover:text-amber-100 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-umber-400" />
              <span>Submissions</span>
            </Link>

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-bronze-metal text-umber-950 text-xs font-bold transition-all shadow-md active:scale-95 hover:brightness-110 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
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
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
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
            <div className="flex bg-umber-900/80 rounded-2xl border border-umber-800 p-1 shadow-2xs">
              <button
                onClick={() => setActiveTab("questions")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === "questions"
                    ? "bg-bronze-metal text-umber-950 shadow-xs"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Questions ({questions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === "settings"
                    ? "bg-bronze-metal text-umber-950 shadow-xs"
                    : "text-umber-300 hover:text-amber-100"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Bot &amp; Form Settings</span>
              </button>
            </div>

            {/* TAB 1: Questions Editor */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="bg-umber-900/40 rounded-2xl border border-umber-800 p-5 shadow-xs transition-all hover:border-bronze-500/50 relative group"
                  >
                    {/* Question Header & Order Controls */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-umber-800/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-umber-950 border border-umber-800 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <select
                          value={q.type}
                          onChange={(e) =>
                            updateQuestion(index, "type", e.target.value as QuestionType)
                          }
                          className="text-xs font-semibold bg-umber-950 border border-umber-800 rounded-lg px-2.5 py-1 text-umber-200 focus:outline-none focus:ring-1 focus:ring-bronze-500"
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
                          className="p-1.5 text-umber-400 hover:text-amber-200 disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveQuestion(index, "down")}
                          disabled={index === questions.length - 1}
                          title="Move down"
                          className="p-1.5 text-umber-400 hover:text-amber-200 disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(index)}
                          title="Delete question"
                          className="p-1.5 text-umber-400 hover:text-rose-400 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content Fields */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-umber-300 mb-1">
                          Question Prompt *
                        </label>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => updateQuestion(index, "title", e.target.value)}
                          placeholder="e.g. What is your full name?"
                          className="w-full px-3 py-2 text-sm bg-umber-950/70 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-umber-400 mb-1">
                          Helper Text or Subtitle (Optional)
                        </label>
                        <input
                          type="text"
                          value={q.description || ""}
                          onChange={(e) => updateQuestion(index, "description", e.target.value)}
                          placeholder="Additional context shown under the question bubble..."
                          className="w-full px-3 py-1.5 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                        />
                      </div>

                      {(q.type === "text" || q.type === "email") && (
                        <div>
                          <label className="block text-xs font-semibold text-umber-400 mb-1">
                            Input Placeholder
                          </label>
                          <input
                            type="text"
                            value={q.placeholder || ""}
                            onChange={(e) => updateQuestion(index, "placeholder", e.target.value)}
                            placeholder={q.type === "email" ? "e.g. you@company.com" : "e.g. Type answer here..."}
                            className="w-full px-3 py-1.5 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 placeholder:text-umber-500 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                          />
                        </div>
                      )}

                      {/* Multiple Choice Options Editor */}
                      {q.type === "multiple_choice" && (
                        <div className="pt-2">
                          <label className="block text-xs font-bold text-umber-300 mb-2">
                            Choice Options
                          </label>
                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="text-xs text-umber-400 font-mono w-4">
                                  {optIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 rounded-lg focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                                />
                                <button
                                  onClick={() => removeOption(index, optIdx)}
                                  disabled={(q.options || []).length <= 1}
                                  className="p-1 text-umber-400 hover:text-rose-400 disabled:opacity-20"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addOption(index)}
                              className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 pt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add another choice option</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Required Question Switch */}
                      <div className="pt-2 flex items-center justify-between border-t border-umber-800/80">
                        <label className="text-xs font-semibold text-umber-300 cursor-pointer flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                            className="rounded accent-bronze-500 w-4 h-4"
                          />
                          <span>Required question (user must answer before continuing)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Question Button Strip */}
                <div className="bg-umber-900/20 rounded-2xl border border-dashed border-umber-800 p-5 text-center">
                  <p className="text-xs font-bold text-amber-200/90 mb-3 uppercase tracking-wider">
                    Add New Question
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => addQuestion("text")}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-umber-900/60 hover:bg-umber-800 border border-umber-800 hover:border-bronze-500 text-umber-200 hover:text-amber-100 transition-all flex items-center gap-1.5"
                    >
                      <Type className="w-3.5 h-3.5 text-bronze-400" />
                      <span>+ Short Text</span>
                    </button>
                    <button
                      onClick={() => addQuestion("email")}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-umber-900/60 hover:bg-umber-800 border border-umber-800 hover:border-bronze-500 text-umber-200 hover:text-amber-100 transition-all flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+ Email</span>
                    </button>
                    <button
                      onClick={() => addQuestion("multiple_choice")}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-umber-900/60 hover:bg-umber-800 border border-umber-800 hover:border-bronze-500 text-umber-200 hover:text-amber-100 transition-all flex items-center gap-1.5"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Multiple Choice</span>
                    </button>
                    <button
                      onClick={() => addQuestion("yes_no")}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-umber-900/60 hover:bg-umber-800 border border-umber-800 hover:border-bronze-500 text-umber-200 hover:text-amber-100 transition-all flex items-center gap-1.5"
                    >
                      <ToggleLeft className="w-3.5 h-3.5 text-violet-400" />
                      <span>+ Yes / No</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bot & Form Settings */}
            {activeTab === "settings" && (
              <div className="bg-umber-900/40 rounded-2xl border border-umber-800 p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold font-display text-umber-50 text-base mb-1 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-bronze-400" />
                    <span>General Form Information</span>
                  </h3>
                  <p className="text-xs text-umber-400 mb-4">
                    Basic details that appear on the form&apos;s header and dashboard.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-umber-300 mb-1">
                        Form Title
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-umber-950/70 border border-umber-800 text-umber-100 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-umber-300 mb-1">
                        Form Description
                      </label>
                      <textarea
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        placeholder="Explain what this form is for..."
                        className="w-full px-3 py-2 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-umber-800/80">
                  <h3 className="font-bold font-display text-umber-50 text-base mb-1 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-bronze-400" />
                    <span>Chatbot Persona &amp; Theme</span>
                  </h3>
                  <p className="text-xs text-umber-400 mb-4">
                    Customize your chatbot&apos;s avatar, bot name, and branding color.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-umber-300 mb-1">
                          Bot Name
                        </label>
                        <input
                          type="text"
                          value={form.botName}
                          onChange={(e) => {
                            setForm({ ...form, botName: e.target.value });
                            refreshPreview();
                          }}
                          className="w-full px-3 py-2 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-umber-300 mb-1">
                          Bot Avatar Emoji
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
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
                                  ? "border-bronze-500 bg-bronze-950/80 scale-105"
                                  : "border-umber-800 bg-umber-950/50 hover:bg-umber-800"
                              }`}
                            >
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-umber-300 mb-1 flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-bronze-400" />
                        <span>Theme Brand Color</span>
                      </label>
                      <div className="flex items-center gap-3 flex-wrap">
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
                                  ? "scale-110 ring-2 ring-offset-2 ring-offset-umber-950 ring-bronze-400"
                                  : "hover:scale-105"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={form.themeColor || "#a96325"}
                            onChange={(e) => {
                              setForm({ ...form, themeColor: e.target.value });
                              refreshPreview();
                            }}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-umber-800 bg-transparent"
                          />
                          <span className="text-xs font-mono text-amber-200">{form.themeColor}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-umber-300 mb-1">
                        Welcome Message (Opening greeting)
                      </label>
                      <textarea
                        value={form.welcomeMessage}
                        onChange={(e) => {
                          setForm({ ...form, welcomeMessage: e.target.value });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-umber-300 mb-1">
                        Completion Message (After answering all questions)
                      </label>
                      <textarea
                        value={form.completionMessage}
                        onChange={(e) => {
                          setForm({ ...form, completionMessage: e.target.value });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-umber-950/70 border border-umber-800 text-umber-100 rounded-xl focus:border-bronze-500 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-5 sticky top-36">
            <div className="bg-umber-900/60 rounded-2xl border border-umber-800 shadow-2xl overflow-hidden ring-1 ring-white/5">
              <div className="px-4 py-3 bg-umber-950 border-b border-umber-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold text-amber-100">Live Interactive Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshPreview}
                    className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                  >
                    <span>Restart Test</span>
                  </button>
                  <a
                    href={`/f/${form.id}`}
                    target="_blank"
                    className="p-1 text-umber-400 hover:text-amber-200 rounded"
                    title="Open standalone page in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="h-[580px] bg-white flex flex-col">
                <ChatbotWidget
                  key={previewKey}
                  form={previewFormObject}
                  isPreview={true}
                  showPreviewBadge={true}
                  showCloseButton={false}
                />
              </div>
            </div>

            <p className="text-[11px] text-center text-umber-400 mt-2">
              💡 Test questions in real-time. Submissions in preview mode won&apos;t pollute production data.
            </p>
          </div>
        </div>
      </div>

      <EmbedModal form={form} isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} />
    </div>
  );
}
