import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { QuestionData } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    // If admin requests all forms explicitly, allow it
    const whereClause =
      user.role === "admin" && scope === "all"
        ? {}
        : { userId: user.id };

    const forms = await prisma.form.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title = "Untitled Form",
      description = "",
      botName = "ChatVibe Assistant",
      botAvatar = "🥐",
      themeColor = "#819e71",
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
        userId: user.id,
        title,
        description,
        botName,
        botAvatar,
        themeColor,
        welcomeMessage,
        completionMessage,
        published,
        questions: {
          create: questions.map((q: QuestionData, index: number) => ({
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
