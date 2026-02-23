import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = parseInt(params.id);
    const item = await storage.updateExperience(id, body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update experience item" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    await storage.deleteExperience(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete experience item" }, { status: 400 });
  }
}
