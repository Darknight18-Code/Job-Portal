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
    const { attachments } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("Job ID is missing", { status: 400 });
    if (!attachments || !Array.isArray(attachments)) {
      return new NextResponse("Invalid attachment data", { status: 400 });
    }

    // Optional: delete existing attachments (if needed)
    // Note: If you're PATCHing to *add* attachments, deleting all existing ones might not be desired.
    // Consider if you want to only add, or replace, or specific update.
    // For replacing:
    await db.attachment.deleteMany({ where: { jobId } });

    // Insert new attachments
    await db.attachment.createMany({
      data: attachments.map((att: { url: string; name: string }) => ({
        url: att.url,
        name: att.name,
        jobId,
      })),
    });

    const inserted = await db.attachment.findMany({ where: { jobId } });

    return NextResponse.json(inserted);
  } catch (error) {
    console.error("[ATTACHMENTS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};