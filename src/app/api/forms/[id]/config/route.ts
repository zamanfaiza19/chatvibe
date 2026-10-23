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
      select: {
        id: true,
        title: true,
        themeColor: true,
        published: true,
        botName: true,
      },
    });

    if (!form || !form.published) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      id: form.id,
      title: form.title,
      primaryColor: form.themeColor,
      themeColor: form.themeColor,
      botName: form.botName,
      position: "right",
      published: form.published,
    });
  } catch (error) {
    console.error("Error fetching form config:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
