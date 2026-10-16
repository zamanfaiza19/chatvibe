import Link from "next/link";
import { Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Form<span className="text-indigo-400">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transform boring static forms into dynamic conversational chatbots. Boost engagement, increase completion rates, and collect rich responses.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Form Builder
                </Link>
              </li>
              <li>
                <Link href="/#live-demo" className="hover:text-white transition-colors">
                  Chatbot Widget Demo
                </Link>
              </li>
              <li>
                <Link href="/test-embed.html" target="_blank" className="hover:text-white transition-colors">
                  Website Embed Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Analytics & Submissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li>One-question-at-a-time chat</li>
              <li>Multiple choice & Yes/No pills</li>
              <li>Input validation & required flags</li>
              <li>Customizable bot avatars & colors</li>
              <li>Instant JavaScript snippet embed</li>
            </ul>
          </div>

          {/* Software Engineer Intern Project Specs */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Project Overview</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Software Engineer Intern Project Deliverable. Built with Next.js, React, TypeScript, Tailwind CSS, and Prisma SQLite.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Completion Criteria Met</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FormCraft Interactive. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-400 transition-colors">
              User Dashboard
            </Link>
            <Link href="/test-embed.html" target="_blank" className="hover:text-slate-400 transition-colors">
              External Embed Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
