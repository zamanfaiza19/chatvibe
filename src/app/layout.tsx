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
  title: "Formchat — Interactive Form Builder with Chatbot Widget",
  description:
    "Build conversational forms that feel like a chat, embed them on any website with a single script tag, and collect answers seamlessly in your dashboard.",
  keywords: [
    "form builder",
    "chatbot widget",
    "conversational forms",
    "interactive forms",
    "embeddable chatbot",
    "customer feedback",
    "lead qualification",
  ],
  authors: [{ name: "Formchat Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-umber-950 text-umber-50 selection:bg-bronze-500 selection:text-umber-950">
        {children}
      </body>
    </html>
  );
}

