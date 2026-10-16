import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const submissions = await prisma.submission.findMany({
      where: { formId: id },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    const parsed = submissions.map((sub) => ({
      ...sub,
      answers: sub.answers.map((ans) => ({
        ...ans,
        question: ans.question
          ? {
              ...ans.question,
              options: ans.question.options ? JSON.parse(ans.question.options) : [],
            }
          : undefined,
      })),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const { answers, isPreview = false } = body;

    // Fetch form and its questions
    const form = await prisma.form.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.published && !isPreview) {
      return NextResponse.json(
        { error: "This form is currently unpublished and not accepting submissions." },
        { status: 403 }
      );
    }

    // If it's just a test preview submission in the builder, don't necessarily persist or return a mock success
    if (isPreview) {
      return NextResponse.json({
        success: true,
        preview: true,
        message: "Preview test submission received successfully!",
      });
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid answers payload" }, { status: 400 });
    }

    // Create the submission record in database
    const submission = await prisma.submission.create({
      data: {
        formId: id,
        answers: {
          create: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value: typeof value === "string" ? value : JSON.stringify(value),
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        message: "Submission received successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting responses:", error);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
