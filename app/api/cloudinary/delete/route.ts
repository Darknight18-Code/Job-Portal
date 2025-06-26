// /app/api/cloudinary/delete/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = async (req: Request) => {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return new NextResponse("Public ID missing", { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("[CLOUDINARY_DELETE_ERROR]", error);
    return new NextResponse("Failed to delete image", { status: 500 });
  }
};
