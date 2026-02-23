import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  try {
    const experience = await storage.getExperience();
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await storage.createExperience(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create experience item" }, { status: 400 });
  }
}
