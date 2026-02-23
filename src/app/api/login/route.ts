import { NextResponse, NextRequest } from "next/server";
import { login } from "@/shared/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const success = await login(username, password);

    if (success) {
      return NextResponse.json({ id: 1, username });
    } else {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
