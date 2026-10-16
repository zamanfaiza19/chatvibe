import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string; subId: string }> }
) {
  try {
    const { subId } = await props.params;

    await prisma.submission.delete({
      where: { id: subId },
    });

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
