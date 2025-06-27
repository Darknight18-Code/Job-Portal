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

    const updatedValues = await req.json();

    const job = await db.job.update({
      where: {
        id: jobId,
        userId: userId, // Required to avoid updating someone else's job
      },
      data: updatedValues,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error(`[JOB_PATCH] : ${error}`); // Use console.error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};