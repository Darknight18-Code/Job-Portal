import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  // TEMPORARY WORKAROUND: Cast the context argument to 'any'
  context: any // This line is changed
) => {
  try {
    const { userId } = await auth();
    // Access jobId from context.params
    const { jobId } = context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 }); // Changed from 404 to 400 for consistency
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId: userId, // Ensure only the owner can unpublish their job
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const unpublishJob = await db.job.update({
      where: {
        id: jobId,
        userId: userId, // Keep userId here to ensure only owner can unpublish their job
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishJob);
  } catch (error) {
    console.error(`[JOB_UNPUBLISH_PATCH] : ${error}`); // Use console.error and specific tag
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};