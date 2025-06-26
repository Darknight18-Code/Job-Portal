import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId: clerkId } = await auth();
    const { userId } = params;

    if (!clerkId || clerkId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return new NextResponse("Missing resumeId", { status: 400 });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Update the active resume
    await db.userProfile.update({
      where: { userId },
      data: {
        activeresumeId: resumeId,
      },
    });

    return new NextResponse("Active resume updated", { status: 200 });
  } catch (error) {
    console.error("[RESUME_ACTIVE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
