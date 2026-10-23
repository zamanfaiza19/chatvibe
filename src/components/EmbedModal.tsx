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

  const scriptCode = `<!-- ChatVibe widget -->
<script src="${origin}/widget.js" data-form="${form.id}" async></script>`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-umber-950 text-umber-50 rounded-2xl shadow-2xl border border-umber-800 w-full max-w-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-umber-800 flex items-center justify-between bg-umber-900/60">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-bronze-metal text-umber-950 flex items-center justify-center">
              <Code className="size-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-umber-50 text-base">Embed &amp; Share Form</h3>
              <p className="text-xs text-umber-300">&ldquo;{form.title}&rdquo;</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-umber-400 hover:text-amber-100 rounded-lg hover:bg-umber-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Public Link Card */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-umber-400 flex items-center gap-1.5">
              <Globe className="size-3.5 text-bronze-400" />
              Direct Public Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 text-xs bg-umber-900 border border-umber-800 rounded-lg font-mono text-amber-200 select-all"
              />
              <button
                onClick={() => copyToClipboard(publicUrl, "link")}
                className="px-3 py-2 bg-bronze-metal hover:brightness-110 text-umber-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
              >
                {copiedType === "link" ? <Check className="size-3.5 text-emerald-950" /> : <Copy className="size-3.5" />}
                {copiedType === "link" ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-umber-800 text-umber-300 hover:text-amber-100 hover:bg-umber-900 rounded-lg shrink-0 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* Embed Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-umber-800 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setEmbedTab("script")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    embedTab === "script"
                      ? "bg-bronze-metal text-umber-950 shadow-sm"
                      : "text-umber-300 hover:bg-umber-900"
                  }`}
                >
                  Floating Chatbot Widget (Recommended)
                </button>
                <button
                  onClick={() => setEmbedTab("iframe")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    embedTab === "iframe"
                      ? "bg-bronze-metal text-umber-950 shadow-sm"
                      : "text-umber-300 hover:bg-umber-900"
                  }`}
                >
                  Embedded Inline iFrame
                </button>
              </div>

              {embedTab === "script" && (
                <a
                  href="/test-embed.html"
                  target="_blank"
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Bakery Test Site</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {embedTab === "script" ? (
              <div className="space-y-2">
                <p className="text-xs text-umber-300">
                  Paste this snippet before the closing <code className="text-amber-300 bg-umber-900 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on any website to embed the floating chat launcher:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-black/60 border border-umber-800 text-amber-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {scriptCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(scriptCode, "script")}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-umber-800 hover:bg-umber-700 text-amber-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === "script" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    {copiedType === "script" ? "Copied" : "Copy Code"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-umber-300">
                  Embed the chatbot directly inside your webpage or blog post layout:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-black/60 border border-umber-800 text-amber-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {iframeCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(iframeCode, "iframe")}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-umber-800 hover:bg-umber-700 text-amber-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === "iframe" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    {copiedType === "iframe" ? "Copied" : "Copy iFrame"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-umber-900/60 border-t border-umber-800 flex items-center justify-between">
          <span className="text-xs text-umber-400">
            Works with HTML, WordPress, Webflow, Shopify, React, Next.js, and Netlify.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-umber-800 hover:bg-umber-700 text-umber-100 text-xs font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
