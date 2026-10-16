import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FormCraft | Interactive Form Builder & Chatbot Widget",
  description:
    "Build modern conversational forms, embed floating chatbot widgets on any website, collect responses, and manage submissions through a powerful dashboard.",
  keywords: [
    "form builder",
    "chatbot widget",
    "conversational forms",
    "interactive forms",
    "embeddable chatbot",
    "customer feedback",
    "lead qualification",
  ],
  authors: [{ name: "FormCraft Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
