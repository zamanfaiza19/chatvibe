import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("formchat_user");
  return response;
}
