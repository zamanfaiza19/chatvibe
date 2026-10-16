import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json().catch(() => ({}));

    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const nextPublished = body.published !== undefined ? Boolean(body.published) : !form.published;

    const updated = await prisma.form.update({
      where: { id },
      data: { published: nextPublished },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error toggling publish:", error);
    return NextResponse.json({ error: "Failed to toggle publish status" }, { status: 500 });
  }
}
