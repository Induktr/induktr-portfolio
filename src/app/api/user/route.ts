import { NextResponse } from "next/server";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  const session = await getSession();
  if (session?.user) {
    return NextResponse.json(session.user);
  }
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
