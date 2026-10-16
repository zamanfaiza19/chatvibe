import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const parsed = {
      ...form,
      questions: form.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();

    const {
      title,
      description,
      published,
      botName,
      botAvatar,
      themeColor,
      welcomeMessage,
      completionMessage,
      questions,
    } = body;

    // Use transaction to update form details and sync questions
    const updatedForm = await prisma.$transaction(async (tx) => {
      // 1. Update basic form data
      const form = await tx.form.update({
        where: { id },
        data: {
          title,
          description,
          published,
          botName,
          botAvatar,
          themeColor,
          welcomeMessage,
          completionMessage,
        },
      });

      // 2. If questions are provided, replace them cleanly
      if (Array.isArray(questions)) {
        // Delete questions that are no longer present
        const incomingIds = questions
          .map((q: any) => q.id)
          .filter(Boolean) as string[];

        await tx.question.deleteMany({
          where: {
            formId: id,
            id: { notIn: incomingIds },
          },
        });

        // Upsert or create each question
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const questionData = {
            order: i,
            type: q.type,
            title: q.title,
            description: q.description || null,
            placeholder: q.placeholder || null,
            required: q.required ?? true,
            options: q.options ? JSON.stringify(q.options) : null,
          };

          if (q.id && !q.id.startsWith("temp-")) {
            await tx.question.upsert({
              where: { id: q.id },
              update: questionData,
              create: {
                ...questionData,
                formId: id,
              },
            });
          } else {
            await tx.question.create({
              data: {
                ...questionData,
                formId: id,
              },
            });
          }
        }
      }

      return form;
    });

    // Fetch refreshed form with questions
    const fullForm = await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    const parsed = {
      ...fullForm,
      questions: fullForm?.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    await prisma.form.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}
