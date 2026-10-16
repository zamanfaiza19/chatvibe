import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    const parsedForms = forms.map((form) => ({
      ...form,
      questions: form.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    }));

    return NextResponse.json(parsedForms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title = "Untitled Form",
      description = "",
      botName = "FormBot",
      botAvatar = "🤖",
      themeColor = "#4f46e5",
      welcomeMessage = "Hi there! 👋 Could you answer a few quick questions for us?",
      completionMessage = "Thank you! 🎉 We have received your answers.",
      published = true,
      questions = [
        {
          order: 0,
          type: "text",
          title: "What is your name?",
          placeholder: "e.g. Jane Doe",
          required: true,
        },
        {
          order: 1,
          type: "email",
          title: "What is your email address?",
          placeholder: "jane@example.com",
          required: true,
        },
      ],
    } = body;

    const newForm = await prisma.form.create({
      data: {
        title,
        description,
        botName,
        botAvatar,
        themeColor,
        welcomeMessage,
        completionMessage,
        published,
        questions: {
          create: questions.map((q: any, index: number) => ({
            order: index,
            type: q.type || "text",
            title: q.title || "Question",
            description: q.description || null,
            placeholder: q.placeholder || null,
            required: q.required ?? true,
            options: q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    const parsed = {
      ...newForm,
      questions: newForm.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}
