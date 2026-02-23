import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  try {
    const faq = await storage.getFAQ();
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch FAQ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await storage.createFAQ(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create FAQ item" }, { status: 400 });
  }
}
