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
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId: clerkId } = await auth();
    const { userId } = params;

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

    console.log("Deleting from Cloudinary:", publicId);

    // Optional: delete with resource_type auto
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    const result = await db.resumes.deleteMany({
      where: {
        userProfileId: userId,
        url,
      },
    });

    console.log("Deleted from DB:", result);

    return new NextResponse("Resume deleted", { status: 200 });
  } catch (error) {
    console.error("[RESUMES_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
