import prisma from "@/lib/prisma";
import FormBuilder from "@/components/FormBuilder";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import { FormData, QuestionType } from "@/types";

export default async function EditFormPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: { submissions: true },
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <FormBuilder initialForm={parsedForm} />
    </div>
  );
}
