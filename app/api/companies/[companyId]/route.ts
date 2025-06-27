import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  // TEMPORARY WORKAROUND: Cast context to 'any' to bypass strict type checking
  context: any // This line is changed
) => {
  try {
    const { userId } = await auth();
    // Safely extract companyId from context.params
    const { companyId } = context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 }); // Changed from "Job ID is missing" for accuracy
    }

    const updatedValues = await req.json();

    const company = await db.company.update({
      where: {
        id: companyId,
        userId: userId, // This ensures only the owner can update their company
      },
      data: updatedValues,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error(`[COMPANY_PATCH] : ${error}`); // Use console.error for errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};