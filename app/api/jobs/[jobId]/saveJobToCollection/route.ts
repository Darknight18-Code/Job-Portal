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
      return new NextResponse("Job ID is missing", { status: 400 }); // Changed from 404 to 400
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        // Removed `userId` from where clause here.
        // If any authenticated user can save any job,
        // then the lookup should only be by `jobId`.
      },
      select: {
        savedUsers: true, // Make sure to select this field
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const currentSavedUsers = job.savedUsers || []; // Ensure it's an array

    // Check if the user is already in the savedUsers list
    const isSaved = currentSavedUsers.includes(userId);

    let updatedJob;

    if (!isSaved) {
      // User is not in savedUsers, so add them (save the job)
      updatedJob = await db.job.update({
        where: {
          id: jobId,
          // Removed `userId` from where clause here for consistency with public saving
        },
        data: {
          savedUsers: {
            push: userId,
          },
        },
      });
      // If this endpoint is strictly for 'saving', you might want to return here.
      // If it's meant to be a toggle (save/unsave), you'd put the unsave logic here too.
    } else {
        // User is already in savedUsers, so do nothing or return a specific status
        // If this endpoint's name implies "add only", then this case is an idempotent no-op or a conflict.
        // For now, it will simply return the existing job.
        return new NextResponse("Job already saved by user", { status: 200 }); // Or 409 Conflict if you prefer
    }


    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_SAVE_TO_COLLECTION_PATCH] : ${error}`); // Use console.error and specific tag
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};