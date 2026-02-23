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
    const project = await storage.updateProject(id, body);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update project" }, { status: 400 });
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
    await storage.deleteProject(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete project" }, { status: 400 });
  }
}
