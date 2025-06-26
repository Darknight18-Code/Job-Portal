// /app/api/jobs/[jobId]/attachments/delete/route.ts

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
    const { url } = await req.json();

    if (!userId || !url) return new NextResponse("Missing info", { status: 400 });

    const attachment = await db.attachment.findFirst({
      where: { jobId: params.jobId, url },
    });

    if (!attachment) return new NextResponse("Attachment not found", { status: 404 });

    const publicId = url.split("/").pop()?.split(".")[0];

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
    }

    await db.attachment.delete({
      where: { id: attachment.id },
    });

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE_ATTACHMENT_BY_URL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

