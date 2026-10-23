import prisma from "@/lib/prisma";
import ChatbotWidget from "@/components/ChatbotWidget";
import { notFound } from "next/navigation";
import { FormData, QuestionType } from "@/types";
import Link from "next/link";
import { MessageSquare, AlertCircle } from "lucide-react";

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
      type: q.type as QuestionType,
      options: q.options ? JSON.parse(q.options) : [],
    })),
  };

  return (
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top micro branding */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pb-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-7 rounded-lg bg-bronze-metal flex items-center justify-center text-umber-950 shadow-xs">
            <MessageSquare className="size-3.5 fill-umber-950" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-umber-50">
            ChatVibe
          </span>
        </Link>
        <span className="text-[11px] text-umber-400">Conversational Form</span>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto shadow-2xl rounded-3xl overflow-hidden border border-umber-800 bg-white ring-1 ring-white/10">
        {!parsedForm.published ? (
          <div className="p-10 text-center space-y-4 bg-umber-950 text-umber-100">
            <div className="size-14 bg-amber-950 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-800">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="text-xl font-bold font-display text-umber-50">Form Currently Offline</h2>
            <p className="text-sm text-umber-300 max-w-sm mx-auto leading-relaxed">
              This form is currently unpublished by its creator and is not accepting new responses at this time.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 text-xs font-bold text-amber-300 hover:text-amber-200"
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
        <p className="text-[11px] text-umber-400">
          Powered by{" "}
          <Link href="/" className="font-semibold text-amber-300 hover:text-amber-200 transition-colors">
            ChatVibe
          </Link>
        </p>
      </div>
    </div>
  );
}
