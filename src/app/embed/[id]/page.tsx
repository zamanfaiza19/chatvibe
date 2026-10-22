import prisma from "@/lib/prisma";
import ChatbotWidget from "@/components/ChatbotWidget";
import { notFound } from "next/navigation";
import { FormData, QuestionType } from "@/types";

export default async function EmbedPage(props: { params: Promise<{ id: string }> }) {
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

  if (!parsedForm.published) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 font-sans">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-1">Form Offline</h3>
        <p className="text-xs text-slate-500 max-w-xs">
          This form is temporarily offline and not accepting responses.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <ChatbotWidget form={parsedForm} isPreview={false} standalone={false} />
    </div>
  );
}
