import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  try {
    const items = await storage.getMarketplace();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch marketplace" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await storage.createMarketplaceItem(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create marketplace item" }, { status: 400 });
  }
}
