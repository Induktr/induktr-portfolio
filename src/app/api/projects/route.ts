import { NextResponse } from "next/server";
import { storage } from "@/shared/api/database/storage";
import { getSession } from "@/shared/lib/auth";

export async function GET() {
  try {
    const projects = await storage.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const project = await storage.createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create project" }, { status: 400 });
  }
}
