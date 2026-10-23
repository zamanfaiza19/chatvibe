"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, Menu, X, ArrowRight, ExternalLink } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-umber-800/60 bg-umber-950/85 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-bronze-metal flex items-center justify-center text-umber-950 shadow-md group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4 fill-umber-950" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-umber-50">
                Formchat
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-umber-300">
            <Link href="/#features" className="hover:text-amber-100 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-amber-100 transition-colors">
              How it works
            </Link>
            <Link href="/#demo" className="hover:text-amber-100 transition-colors">
              Demo
            </Link>
            <Link
              href="/test-embed.html"
              target="_blank"
              className="hover:text-amber-100 transition-colors flex items-center gap-1.5 text-amber-200/90"
            >
              <span>Bakery Test Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link href="/dashboard" className="hover:text-amber-100 transition-colors">
              Dashboard
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard/forms/new"
              className="bg-bronze-metal rounded-full px-5 py-2 text-sm font-semibold text-umber-950 shadow-[0_4px_16px_-4px_rgba(203,125,46,0.5)] hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Create a free form</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-umber-300 hover:text-amber-100 hover:bg-umber-900/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-umber-800 bg-umber-950 px-4 pt-3 pb-6 space-y-3 animate-slide-up">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-umber-200 hover:bg-umber-900 rounded-lg"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-umber-200 hover:bg-umber-900 rounded-lg"
          >
            How it works
          </Link>
          <Link
            href="/#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-umber-200 hover:bg-umber-900 rounded-lg"
          >
            Live Demo
          </Link>
          <Link
            href="/test-embed.html"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-base font-semibold text-amber-200 hover:bg-umber-900 rounded-lg"
          >
            <span>Sunny Side Bakery Test</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-umber-200 hover:bg-umber-900 rounded-lg"
          >
            Dashboard
          </Link>
          <div className="pt-2">
            <Link
              href="/dashboard/forms/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold bg-bronze-metal text-umber-950"
            >
              <span>Create a free form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
