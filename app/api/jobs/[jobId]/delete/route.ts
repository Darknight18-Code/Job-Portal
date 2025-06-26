import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("Job ID is required", { status: 400 });

    // 1. Fetch the job with its attachments
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { attachments: true },
    });

    if (!job) return new NextResponse("Job not found", { status: 404 });

    // 2. Delete cover image from Cloudinary if present
    if (job.imageUrl) {
      const coverPublicId = job.imageUrl.split("/").pop()?.split(".")[0];
      if (coverPublicId) {
        await cloudinary.uploader.destroy(coverPublicId, { resource_type: "image" });
      }
    }

    // 3. Delete attachments from Cloudinary
    await Promise.all(
      job.attachments.map(async (attachment) => {
        const filenameWithExt = attachment.url.split("/").pop();
        const publicId = filenameWithExt?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
          } catch (err) {
            console.warn("Failed to delete attachment from Cloudinary:", err);
          }
        }
      })
    );

    // 4. Delete attachments from DB
    await db.attachment.deleteMany({
      where: { jobId },
    });

    // 5. Delete the job itself
    await db.job.delete({
      where: { id: jobId },
    });

    return new NextResponse("Job and associated assets deleted", { status: 200 });
  } catch (error) {
    console.error("[JOB_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
