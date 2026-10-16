import prisma from "@/lib/prisma";
import ChatbotWidget from "@/components/ChatbotWidget";
import { notFound } from "next/navigation";
import { FormData } from "@/types";

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
      type: q.type as any,
      options: q.options ? JSON.parse(q.options) : [],
    })),
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <ChatbotWidget form={parsedForm} isPreview={false} standalone={false} />
    </div>
  );
}
