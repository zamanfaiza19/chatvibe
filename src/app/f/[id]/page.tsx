import prisma from "@/lib/prisma";
import ChatbotWidget from "@/components/ChatbotWidget";
import { notFound } from "next/navigation";
import { FormData } from "@/types";
import Link from "next/link";
import { Bot, AlertCircle } from "lucide-react";

export default async function PublicFormPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!form) {
    notFound();
  }

  const parsedForm: FormData = {
    ...form,
    questions: form.questions.map((q) => ({
      ...q,
      type: q.type as any,
      options: q.options ? JSON.parse(q.options) : [],
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top micro branding */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pb-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-700 tracking-tight">
            Form<span className="text-indigo-600">Craft</span>
          </span>
        </Link>
        <span className="text-[11px] text-slate-400">Interactive Conversational Form</span>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
        {!parsedForm.published ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Form Currently Offline</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              This form is currently unpublished by its creator and is not accepting new responses at this time.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Return to Homepage →
            </Link>
          </div>
        ) : (
          <div className="h-[650px] sm:h-[680px]">
            <ChatbotWidget form={parsedForm} isPreview={false} standalone={false} />
          </div>
        )}
      </div>

      {/* Footer credit */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-slate-400">
          Powered by{" "}
          <Link href="/" className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            FormCraft
          </Link>
        </p>
      </div>
    </div>
  );
}
