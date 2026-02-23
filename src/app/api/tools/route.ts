import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  try {
    const tools = await storage.getTools();
    return NextResponse.json(tools);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch tools" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tool = await storage.createTool(body);
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create tool" }, { status: 400 });
  }
}
