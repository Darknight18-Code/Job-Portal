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

    const body = await req.json();
    const { resumes } = body;

    if (!Array.isArray(resumes)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    console.log("[RESUME_UPLOAD] Incoming resumes:", resumes);

    const existingProfile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    const createdResumes = await db.$transaction(
  resumes.map((resume: { url: string; name: string }) =>
    db.resumes.upsert({
      where: {
        // Define a compound unique constraint in Prisma if needed, or just check `url`
        userProfileId_url: {
          userProfileId: userId,
          url: resume.url,
        },
      },
      create: {
        name: resume.name,
        url: resume.url,
        userProfileId: userId,
      },
      update: {}, // do nothing if already exists
    })
  )
);


    return NextResponse.json(createdResumes);
  } catch (error) {
    console.error("[RESUMES_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
