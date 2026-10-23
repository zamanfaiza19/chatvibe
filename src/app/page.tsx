import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { FormData, QuestionType } from "@/types";
import Link from "next/link";
import Script from "next/script";
import {
  Sparkles,
  ArrowRight,
  Sliders,
  MessageSquare,
  Globe,
  ShieldCheck,
  BarChart3,
  Palette,
  ExternalLink,
  Code2,
  CheckCircle2,
} from "lucide-react";

export default async function LandingPage() {
  // Fetch sample form to power the live demo on the landing page (prefer Sunny Side Bakery)
  const sampleFormRecord = await prisma.form.findFirst({
    where: { published: true },
    orderBy: { createdAt: "asc" },
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
          type: q.type as QuestionType,
          options: q.options ? JSON.parse(q.options) : [],
        })),
      }
    : {
        id: "demo",
        title: "Pistachio & Sage Cafe",
        description: "Artisan drinks and treats ordering form.",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        botName: "Cafe Concierge",
        botAvatar: "🌿",
        themeColor: "#819e71",
        welcomeMessage: "Hi! 👋 Welcome to Pistachio & Sage Cafe. I’ll take your drink & pastry order in a few quick taps.",
        completionMessage: "Order placed! ☕ We’ll have it freshly prepared for you. (This was a demo — nothing was saved.)",
        questions: [
          {
            order: 0,
            type: "text",
            title: "What’s your name?",
            placeholder: "e.g. Maya Lin",
            required: true,
          },
          {
            order: 1,
            type: "email",
            title: "Which email should we send the quote to?",
            placeholder: "maya@example.com",
            required: true,
          },
          {
            order: 2,
            type: "multiple_choice",
            title: "Which flavour would you like?",
            options: ["Chocolate fudge", "Lemon drizzle", "Carrot & walnut", "Vanilla berry"],
            required: true,
          },
          {
            order: 3,
            type: "yes_no",
            title: "Do you need it delivered?",
            required: true,
          },
          {
            order: 4,
            type: "text",
            title: "Anything else we should know?",
            placeholder: "Dietary restrictions, decoration ideas, or delivery date...",
            required: false,
          },
        ],
      };

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col selection:bg-bronze-500 selection:text-umber-950 font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36">
        {/* Warm radial bronze glow */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_15%,rgba(129,158,113,0.22),transparent)]"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-bronze-400/30 bg-bronze-950/40 px-3.5 py-1 text-xs font-semibold text-bronze-300 mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-bronze-400" />
            <span>Interactive Form Builder &amp; Chatbot Widget</span>
          </div>

          {/* Headline */}
          <h1 className="text-bronze-metal font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.035em] pb-2 max-w-4xl mx-auto">
            Turn boring surveys into engaging conversations.
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg sm:text-xl text-umber-300 max-w-2xl mx-auto leading-relaxed">
            ChatVibe replaces stiff web forms with intuitive conversational chatbots that people actually enjoy answering. Collect qualified leads, collect genuine feedback, and boost completion rates effortlessly.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/forms/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-bronze-metal text-umber-950 font-bold text-[15px] shadow-[0_10px_30px_-10px_rgba(129,158,113,0.6)] hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Create a free form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-umber-700 bg-umber-900/60 text-umber-100 hover:bg-umber-900 font-semibold text-[15px] transition-all"
            >
              <span>Try the live demo</span>
            </a>
          </div>

          {/* Conversational Mock Bubble Preview in Hero */}
          <div className="mt-16 max-w-lg mx-auto bg-umber-900/70 border border-umber-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-left space-y-3.5 ring-1 ring-white/5">
            <div className="flex items-center gap-2 border-b border-umber-800 pb-3 text-xs text-umber-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-umber-200">ChatVibe Live Preview</span>
            </div>

            {/* Bubble 1: Bot */}
            <div className="flex items-start gap-2.5">
              <div className="size-7 rounded-full bg-bronze-metal flex items-center justify-center text-xs text-umber-950 shrink-0 font-bold">
                🥐
              </div>
              <div className="bg-umber-800/80 text-umber-100 border border-umber-700/60 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs leading-relaxed max-w-[85%]">
                Hi! 👋 Planning an event with us?
              </div>
            </div>

            {/* Bubble 2: User */}
            <div className="flex items-center justify-end">
              <div className="bg-bronze-600 text-white rounded-2xl rounded-tr-xs px-4 py-2 text-xs leading-relaxed shadow-sm">
                Yes, a birthday party in June
              </div>
            </div>

            {/* Bubble 3: Bot */}
            <div className="flex items-start gap-2.5">
              <div className="size-7 rounded-full bg-bronze-metal flex items-center justify-center text-xs text-umber-950 shrink-0 font-bold">
                🥐
              </div>
              <div className="bg-umber-800/80 text-umber-100 border border-umber-700/60 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs leading-relaxed max-w-[85%]">
                Lovely. What’s the best email to reach you?
              </div>
            </div>

            {/* Bubble 4: User */}
            <div className="flex items-center justify-end">
              <div className="bg-bronze-600 text-white rounded-2xl rounded-tr-xs px-4 py-2 text-xs leading-relaxed shadow-sm">
                maya@example.com
              </div>
            </div>

            {/* Response toast */}
            <div className="mt-2 pt-2 border-t border-umber-800/60 flex items-center justify-between text-[11px] text-amber-300/90 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                New response saved to your dashboard
              </span>
              <span className="text-umber-400">Just now</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-umber-950 border-t border-umber-800/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-umber-50 leading-tight">
              From the first question to the last answer
            </h2>
            <p className="text-umber-300 mt-3 text-base">
              Everything you need to turn standard static forms into high-converting conversational widgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <Sliders className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">Build without code</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Add text, email, multiple-choice and yes/no questions, mark the ones that are required and drag them into order.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">One question at a time</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Visitors answer in a chat, so a ten-question form feels like a short conversation instead of a wall of fields.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <Globe className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">Embed on any website</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Paste one script tag. The chat bubble works on desktop and mobile and never clashes with your site’s styles.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">Answers are checked</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Required questions can’t be skipped and email addresses are validated — in the chat and again on the server.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">Every response in one place</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Each submission is saved with its time and where it came from. Read them in the dashboard or export a CSV.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-900/40 p-7 hover:border-bronze-500/50 hover:bg-umber-900/70 transition-all group">
              <div className="size-10 rounded-xl bg-bronze-900/60 border border-bronze-700/40 flex items-center justify-center text-bronze-300 mb-5 group-hover:scale-105 transition-transform">
                <Palette className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-umber-50 mb-2">Your colors, your words</h3>
              <p className="text-sm text-umber-300 leading-relaxed">
                Choose a brand color and write your own welcome and thank-you messages. Changes reach every embed instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-umber-900/60 border-t border-umber-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-umber-50 leading-tight">
              Live on your website in four steps
            </h2>
            <p className="text-umber-300 mt-3 text-base">
              A frictionless workflow designed to take you from a question list to active responses in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-950 p-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-bronze-400">Step 1</span>
              <h3 className="mt-3 text-lg font-semibold text-umber-50">Build your form</h3>
              <p className="mt-2 text-sm text-umber-300 leading-relaxed">
                Add questions in the builder and watch the chat preview update as you type.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-950 p-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-bronze-400">Step 2</span>
              <h3 className="mt-3 text-lg font-semibold text-umber-50">Publish it</h3>
              <p className="mt-2 text-sm text-umber-300 leading-relaxed">
                Publishing gives the form a public link you can share straight away.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-950 p-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-bronze-400">Step 3</span>
              <h3 className="mt-3 text-lg font-semibold text-umber-50">Embed it</h3>
              <p className="mt-2 text-sm text-umber-300 leading-relaxed">
                Copy one line into your website and a chat bubble appears in the corner.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-umber-800 bg-umber-950 p-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-bronze-400">Step 4</span>
              <h3 className="mt-3 text-lg font-semibold text-umber-50">Read the answers</h3>
              <p className="mt-2 text-sm text-umber-300 leading-relaxed">
                Every response lands in your dashboard with the time it was submitted.
              </p>
            </div>
          </div>

          {/* Snippet box */}
          <div className="mt-14 overflow-hidden rounded-2xl bg-umber-950 border border-umber-800 text-sm">
            <div className="border-b border-umber-800 px-5 py-3 text-xs font-semibold text-umber-400 flex items-center justify-between">
              <span>Step 3 — the only code you add to your site</span>
              <span className="text-bronze-400 font-mono text-[11px]">paste before &lt;/body&gt;</span>
            </div>
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-amber-200">
              <code>
                &lt;<span className="text-bronze-300">script</span>{" "}
                <span className="text-umber-300">src</span>=&quot;http://localhost:3000/widget.js&quot;{" "}
                <span className="text-umber-300">data-form</span>=&quot;{sampleForm.id}&quot;{" "}
                <span className="text-umber-300">async</span>&gt;&lt;/<span className="text-bronze-300">script</span>&gt;
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE DEMO SECTION (#demo) */}
      <section id="demo" className="relative scroll-mt-16 overflow-hidden border-t border-umber-800/80 bg-umber-950 py-20 lg:py-28">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_80%_50%,rgba(129,158,113,0.2),transparent)]"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.25fr]">
          {/* Left Column */}
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-umber-50 leading-tight">
              Try it yourself
            </h2>
            <p className="mt-5 text-base sm:text-lg text-umber-300 leading-relaxed">
              This is the widget the way visitors see it on a website. Answer the questions, try skipping a required one or typing a broken email address. It’s a preview, so nothing is saved.
            </p>
            <p className="mt-4 text-sm text-umber-400 leading-relaxed">
              The chat bubble in the bottom corner of this page is the real embedded widget. Answers sent through it are saved like any other response.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard/forms/new"
                className="bg-bronze-metal rounded-full px-6 py-3 text-[15px] font-semibold text-umber-950 shadow-[0_10px_30px_-10px_rgba(129,158,113,0.6)] hover:brightness-110 active:scale-95 transition-all"
              >
                Build your own
              </Link>
              <Link
                href="/test-embed.html"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>Open Pistachio & Sage Cafe testbed</span>
                <ExternalLink className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Pretend Website Window (Pistachio & Sage Cafe) with embedded Chatbot */}
          <div className="overflow-hidden rounded-2xl bg-umber-950 shadow-2xl border border-bronze-400/20 ring-1 ring-white/5">
            {/* Browser top chrome */}
            <div className="flex items-center gap-2 border-b border-umber-800 bg-umber-900 px-4 py-3">
              <span className="size-3 rounded-full bg-umber-700" />
              <span className="size-3 rounded-full bg-umber-700" />
              <span className="size-3 rounded-full bg-umber-700" />
              <span className="ml-3 flex-1 truncate rounded-md bg-umber-950 px-3 py-1 text-xs text-umber-400 font-mono">
                pistachiosagecafe.com
              </span>
            </div>

            {/* Pretend Cafe Page Content with embedded chatbot on bottom-right */}
            <div className="relative bg-[#fff8ef] h-[580px] overflow-hidden">
              {/* Cafe mock page layout */}
              <div aria-hidden={true} className="hidden sm:block p-8">
                <p className="font-serif text-2xl font-bold text-[#142010]">
                  🌿 Pistachio & Sage Cafe
                </p>
                <div className="mt-6 h-4 w-3/5 rounded bg-[#e5ece1]" />
                <div className="mt-2.5 h-4 w-2/5 rounded bg-[#e5ece1]" />
                <div className="mt-8 grid w-1/2 grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl bg-[#d6eccb]/60 border border-[#c4dfb9]/40" />
                  <div className="h-20 rounded-xl bg-[#d6eccb]/60 border border-[#c4dfb9]/40" />
                </div>
              </div>

              {/* Chatbot widget in bottom corner of mock site */}
              <div className="h-full sm:h-[490px] sm:w-[360px] sm:absolute sm:right-5 sm:bottom-5 sm:overflow-hidden sm:rounded-2xl sm:shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-amber-900/10">
                <ChatbotWidget
                  form={sampleForm}
                  isPreview={false}
                  showPreviewBadge={false}
                  showCloseButton={false}
                  standalone={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Real Formchat floating widget for the landing page */}
      <Script
        src="/widget.js"
        data-form={sampleForm.id}
        strategy="lazyOnload"
      />
    </div>
  );
}
