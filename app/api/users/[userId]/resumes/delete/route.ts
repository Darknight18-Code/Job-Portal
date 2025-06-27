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

    const { url } = await req.json();
    if (!url) {
      return new NextResponse("Missing URL", { status: 400 });
    }

    const segments = url.split("/");
    const publicIdWithExtension = segments[segments.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    console.log("Attempting to delete from Cloudinary:", publicId);

    // Optional: delete with resource_type auto. Use 'raw' if it's a general file upload for resumes.
    // Assuming resumes are generally PDF or similar documents, 'raw' is often more appropriate
    // than 'image' for Cloudinary deletion unless you're explicitly converting them to images.
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw", // Changed to 'raw' - adjust if your resumes are always images
    });

    const result = await db.resumes.deleteMany({
      where: {
        userProfileId: userId, // This refers to the Prisma model's relationship field
        url,
      },
    });

    console.log("Deleted from DB:", result);

    return new NextResponse("Resume deleted", { status: 200 });
  } catch (error) {
    console.error("[RESUMES_DELETE]", error); // Use console.error for errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};