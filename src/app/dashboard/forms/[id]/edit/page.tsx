import prisma from "@/lib/prisma";
import FormBuilder from "@/components/FormBuilder";
import Navbar from "@/components/Navbar";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { FormData, QuestionType } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditFormPage(props: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

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

  // If the form has no user assigned (legacy form), assign it to current user; otherwise check ownership
  if (!form.userId) {
    await prisma.form.update({
      where: { id: form.id },
      data: { userId: user.id },
    });
  } else if (user.role !== "admin" && form.userId !== user.id) {
    // User does not have permission to edit someone else's form
    redirect("/dashboard");
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
    <div className="min-h-screen bg-umber-950 text-umber-50 flex flex-col font-sans">
      <Navbar />
      <FormBuilder initialForm={parsedForm} />
    </div>
  );
}
