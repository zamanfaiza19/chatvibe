import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { FormData } from "@/types";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  Code,
  Layers,
  BarChart3,
  MessageSquare,
  Globe,
  Sliders,
  ShieldCheck,
  Zap,
  ExternalLink,
} from "lucide-react";


export default async function LandingPage() {
  // Fetch sample form to power the live demo on the landing page
  const sampleFormRecord = await prisma.form.findFirst({
    where: { published: true },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  const sampleForm: FormData = sampleFormRecord
    ? {
        ...sampleFormRecord,
        questions: sampleFormRecord.questions.map((q) => ({
          ...q,
          type: q.type as any,
          options: q.options ? JSON.parse(q.options) : [],
        })),
      }
    : {
        id: "demo",
        title: "Product Discovery & Feedback",
        description: "Live interactive demo form",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        botName: "PulseBot",
        botAvatar: "⚡",
        themeColor: "#4f46e5",
        welcomeMessage: "Hey there! 👋 Welcome to FormCraft. Ready to see how conversational forms work?",
        completionMessage: "Fantastic! 🎉 You've experienced the interactive chatbot widget.",
        questions: [
          {
            order: 0,
            type: "text",
            title: "What is your full name?",
            placeholder: "e.g. Alex Morgan",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "What is your email address?",
            placeholder: "alex@example.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "How did you find out about us?",
            options: ["Twitter / X", "LinkedIn", "Google Search", "Friend / Colleague"],
            required: true,
          },
          {
            order: 3,
            type: "yes_no",
            title: "Would you recommend conversational forms over traditional web forms?",
            required: true,
          },
        ],
      };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: "3s" }} />
              <span>Interactive Form Builder & Chatbot Widget</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Turn Boring Static Forms into{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Engaging Chatbots
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create conversational forms that guide users one question at a time. Embed a floating chatbot on any website or share unique links to triple your completion rates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all active:scale-95"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#live-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-sm transition-all"
              >
                <span>Try Live Demo</span>
                <Bot className="w-4 h-4 text-indigo-600" />
              </a>
            </div>

            {/* Quick highlight pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3x Higher Completion Rates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>1-Line Website Embed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-Time Response Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blur rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-200/20 blur-3xl rounded-full -z-0 pointer-events-none" />
      </section>

      {/* LIVE INTERACTIVE CHATBOT DEMO SECTION */}
      <section id="live-demo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Live Demo Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Interactive Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Experience the Conversational Chatbot Widget
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Try filling out the interactive form on the right. Notice how questions are asked step-by-step with typing animations, custom inputs (text, email validation, multiple-choice buttons, Yes/No pills), and celebration upon completion.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">One Question at a Time</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Removes cognitive friction by guiding visitors in a friendly conversation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Easy Embed Snippet</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Drop into any external website with a simple script tag or iframe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Instant Data Storage</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Responses are stored in SQLite and accessible via the user dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/test-embed.html"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>See widget floating on a test website</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Live Chatbot Widget */}
            <div className="lg:col-span-7">
              <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-white">
                <div className="h-[600px]">
                  <ChatbotWidget form={sampleForm} isPreview={false} standalone={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background glow effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Powerful Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to collect richer data
            </h3>
            <p className="text-slate-500 text-sm mt-3">
              Crafted from the ground up for maximum user engagement and developer simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Conversational UI</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Presents questions dynamically one by one, featuring typing pauses, pleasant sound effects, and confetti on completion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Flexible Question Types</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full support for Text, validated Email addresses, Multiple Choice buttons, and interactive Yes/No pills with required toggles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">1-Click Website Embed</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Easily embed a floating chatbot widget on WordPress, Webflow, Shopify, or custom HTML sites using a single script tag.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Analytics & Export</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Inspect responses in an organized table or breakdown charts. Export all submitted answers to CSV or JSON with a single click.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Theme & Persona Branding</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customize bot name, avatar emoji, welcome greeting, completion message, and accent color to match your brand identity.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Instant Public URLs</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every published form receives a unique public share URL for direct distribution in newsletters, emails, or social media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Simple Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From idea to live chatbot in 3 steps
            </h3>
            <p className="text-slate-500 text-sm mt-3">
              No complex logic trees or tedious setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Build Your Questions</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Add text, email, multiple-choice, and yes/no questions. Reorder questions with up/down arrows and set required flags.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Customize & Preview</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pick your bot's name, avatar emoji, welcome greeting, and brand color. Test the live interactive preview right in your browser.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Publish & Collect</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Publish with one click. Embed the floating widget snippet on your website or share direct links, and monitor answers in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl shadow-indigo-600/20 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to build your first interactive form?
              </h2>
              <p className="text-indigo-100 text-base leading-relaxed">
                Create engaging chatbots, collect rich feedback, and embed them anywhere in seconds.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-base hover:bg-indigo-50 shadow-md transition-all active:scale-95"
                >
                  <span>Go to User Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
