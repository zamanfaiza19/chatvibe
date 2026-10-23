import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-umber-800/80 bg-umber-950 text-umber-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-umber-50 group">
              <div className="size-7 rounded-lg bg-bronze-metal flex items-center justify-center text-umber-950 shadow-md">
                <MessageSquare className="w-3.5 h-3.5 fill-umber-950" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">ChatVibe</span>
            </Link>
            <p className="text-sm text-umber-300 leading-relaxed">
              Build forms, embed them on any website as a friendly chat widget and manage every response from one dashboard.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-umber-100 mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-umber-300">
              <li>
                <Link href="/#features" className="hover:text-amber-100 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-amber-100 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="hover:text-amber-100 transition-colors">
                  Live demo
                </Link>
              </li>
              <li>
                <Link href="/test-embed.html" target="_blank" className="hover:text-amber-100 transition-colors flex items-center gap-1">
                  <span>Pistachio & Sage Cafe</span>
                  <ExternalLink className="w-3 h-3 text-umber-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-umber-100 mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-umber-300">
              <li>
                <Link href="/dashboard/forms/new" className="hover:text-amber-100 transition-colors">
                  Create Form
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-100 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-100 transition-colors">
                  Responses & Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Stack */}
          <div>
            <h4 className="text-sm font-semibold text-umber-100 mb-4">Open Source</h4>
            <p className="text-xs text-umber-400 mb-3 leading-relaxed">
              ChatVibe is an open-source project built with Next.js, SQLite/Supabase, and Tailwind CSS.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-umber-900/80 border border-umber-800 text-xs text-amber-300 font-medium">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-umber-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-umber-500 gap-4">
          <p>© {new Date().getFullYear()} ChatVibe. Conversational forms that convert.</p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-amber-100 transition-colors">
              User Dashboard
            </Link>
            <Link href="/test-embed.html" target="_blank" className="hover:text-amber-100 transition-colors">
              Bakery Testbed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
