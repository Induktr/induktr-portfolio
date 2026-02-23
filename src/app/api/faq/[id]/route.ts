import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: idStr } = await params;
    const body = await req.json();
    const id = parseInt(idStr);
    const item = await storage.updateFAQ(id, body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update FAQ item" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await storage.deleteFAQ(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete FAQ item" }, { status: 400 });
  }
}
