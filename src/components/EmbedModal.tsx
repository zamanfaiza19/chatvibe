"use client";

import { useState } from "react";
import { FormData } from "@/types";
import { Copy, Check, Code, ExternalLink, Globe, X } from "lucide-react";

interface EmbedModalProps {
  form: FormData;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmbedModal({ form, isOpen, onClose }: EmbedModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [embedTab, setEmbedTab] = useState<"script" | "iframe">("script");

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicUrl = `${origin}/f/${form.id}`;
  const embedUrl = `${origin}/embed/${form.id}`;

  const scriptCode = `<!-- FormCraft Chatbot Widget Embed -->
<script
  src="${origin}/embed.js"
  data-form-id="${form.id}"
  data-color="${form.themeColor || "#4f46e5"}"
  data-position="right"
  defer
></script>`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);"
  allow="clipboard-write"
></iframe>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Embed & Share Form</h3>
              <p className="text-xs text-slate-500">&ldquo;{form.title}&rdquo;</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Public Link Card */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Direct Public Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-700 select-all"
              />
              <button
                onClick={() => copyToClipboard(publicUrl, "link")}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedType === "link" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === "link" ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg shrink-0 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Embed Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setEmbedTab("script")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    embedTab === "script"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Floating Chatbot Widget (Recommended)
                </button>
                <button
                  onClick={() => setEmbedTab("iframe")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    embedTab === "iframe"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Embedded Inline iFrame
                </button>
              </div>

              {embedTab === "script" && (
                <a
                  href="/test-embed.html"
                  target="_blank"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Test on demo site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {embedTab === "script" ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Paste this snippet before the closing <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on any website to embed the floating chat launcher:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {scriptCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(scriptCode, "script")}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors backdrop-blur-sm"
                  >
                    {copiedType === "script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === "script" ? "Copied Snippet" : "Copy Code"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Embed the chatbot directly inside your webpage or blog post layout:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {iframeCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(iframeCode, "iframe")}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors backdrop-blur-sm"
                  >
                    {copiedType === "iframe" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === "iframe" ? "Copied iFrame" : "Copy iFrame"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Works with WordPress, Webflow, Shopify, React, Next.js, HTML, and more.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
