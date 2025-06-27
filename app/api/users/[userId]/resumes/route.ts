import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  // TEMPORARY WORKAROUND: Cast the context argument to 'any'
  context: any // This line is changed
) => {
  try {
    const { userId: clerkId } = await auth();
    // Access userId from context.params
    const { userId } = context.params;

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

    // IMPORTANT: For the 'userProfileId_url' in the 'where' clause of upsert,
    // ensure you have this compound unique constraint defined in your Prisma schema:
    // model Resumes {
    //   id            String     @id @default(uuid())
    //   url           String     @unique // or not unique if multiple users can upload same URL
    //   name          String
    //   userProfileId String
    //   userProfile   UserProfile @relation(fields: [userProfileId], references: [userId])
    //
    //   @@unique([userProfileId, url]) // <--- THIS COMPOUND UNIQUE CONSTRAINT IS REQUIRED FOR upsert
    // }

    const createdResumes = await db.$transaction(
      resumes.map((resume: { url: string; name: string }) =>
        db.resumes.upsert({
          where: {
            userProfileId_url: { // This compound key must be defined as @@unique in your Prisma schema
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
    console.error("[RESUMES_PATCH]", error); // Use console.error for errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};