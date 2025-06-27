import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
    req : Request,
    // TEMPORARY WORKAROUND: Cast the context argument to 'any'
    context: any // This line is changed
) => {
    try {
        const {userId} = await auth();
        // Access jobId from context.params
        const {jobId} = context.params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!jobId) {
            return new NextResponse("Job ID is missing", { status: 400 }); // Changed from 404 to 400
        }

        // Fetch the job to get its current savedUsers
        const job = await db.job.findUnique({
            where:{
                id : jobId,
                // Removed userId from where clause here if any user can save/unsave
                // It means a user can save/unsave any job, not just jobs they own
            },
            select: {
                savedUsers: true, // Select the savedUsers array
            }
        });

        if(!job){
            return new NextResponse("Job Not Found", {status:404});
        }

        // Ensure savedUsers is an array
        const currentSavedUsers = job.savedUsers || [];

        const userIndex = currentSavedUsers.indexOf(userId);
        let updatedJob;

        if(userIndex !== -1){
            // User has saved this job, so unsave (remove userId)
            updatedJob = await db.job.update({
                where:{
                    id : jobId,
                    // removed userId from here as well for saving/unsaving by any user
                },
                data: {
                    savedUsers : {
                        set : currentSavedUsers.filter((savedUserId) => savedUserId !== userId)
                    }
                }
            })
        } else {
            // User has NOT saved this job, so save (add userId)
            updatedJob = await db.job.update({
                where:{
                    id : jobId,
                    // removed userId from here as well for saving/unsaving by any user
                },
                data: {
                    savedUsers : {
                        push : userId
                    }
                }
            })
        }

        return NextResponse.json(updatedJob);

    } catch (error) {
        console.error(`[JOB_SAVE_UNSAVE_PATCH] : ${error}`); // Changed log tag for clarity
        return new NextResponse("Internal Server Error", {status: 500});
    }
}