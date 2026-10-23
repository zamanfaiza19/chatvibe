import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/admin/users/[id]/suspend — toggle user suspension
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await props.params;
    const body = await request.json().catch(() => ({}));

    // Prevent suspending oneself
    if (id === admin.id) {
      return NextResponse.json({ error: "Cannot suspend your own admin account" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isSuspended: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextSuspended =
      body.isSuspended !== undefined ? Boolean(body.isSuspended) : !targetUser.isSuspended;

    const updated = await prisma.user.update({
      where: { id },
      data: { isSuspended: nextSuspended },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuspended: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin user suspend error:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}
