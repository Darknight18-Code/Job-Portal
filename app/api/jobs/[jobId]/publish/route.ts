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
            return new NextResponse("Job ID is missing", { status: 400 }); // Changed status from 404 to 400 for missing input
        }

        const job = await db.job.findUnique({
            where:{
                id : jobId,
                userId // Ensure only the owner can publish their job
            }
        })

        if(!job){
            return new NextResponse("Job Not Found", {status:404});
        }

        // Add validation: Check if job is complete before publishing
        const requiredFields = [
            "title",
            "description",
            "categoryId",
            "location",
            "salary",
            "experience",
            "qualification",
            "responsibility",
            "shiftTiming",
            "workMode",
            // "imageUrl", // Uncomment if cover image is strictly required for publishing
        ];

        const allFieldsFilled = requiredFields.every(
            (field) => job[field as keyof typeof job] // Cast to keyof typeof job to access properties dynamically
        );

        // Check if there are attachments (if required for publishing)
        // const attachmentsCount = await db.attachment.count({
        //     where: {
        //         jobId: job.id,
        //     },
        // });
        // if (!attachmentsCount) {
        //     return new NextResponse("At least one attachment is required to publish", { status: 400 });
        // }


        if (!allFieldsFilled) {
            return new NextResponse("Missing required fields", { status: 400 });
        }


        const publishJob = await db.job.update({
            where:{
                id : jobId,
                userId // Keep userId here to ensure only owner can publish their job
            },
            data:{
                isPublished:true,
            }

        })

        return NextResponse.json(publishJob);

    } catch (error) {
        console.error(`[JOB_PUBLISH_PATCH] : ${error}`); // Use console.error
        return new NextResponse("Internal Server Error", {status: 500});
    }
}