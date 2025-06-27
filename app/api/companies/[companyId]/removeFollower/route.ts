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
    const { companyId } = context.params; // Access params directly from context

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      // Changed to 'Company ID is missing' for clarity
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        // Ensure followers is selected to access it
        followers: true,
      },
    });

    if (!company) {
      // Changed status to 404 for 'not found'
      return new NextResponse("Company not found", { status: 404 });
    }

    // --- Start of Follow/Unfollow Logic ---
    // Ensure company.followers is initialized to an empty array if null/undefined
    const currentFollowers = company.followers || [];
    const userIndex = currentFollowers.indexOf(userId);

    if (userIndex !== -1) {
      // User is following, so unfollow (remove userId)
      const updatedCompany = await db.company.update({
        where: {
          id: companyId,
          // IMPORTANT: Removed 'userId' from where clause if this is a "follow/unfollow" endpoint for any user
          // If you *only* want the company owner to manage followers, keep 'userId' here.
          // Otherwise, it should just be { id: companyId }.
        },
        data: {
          followers: {
            set: currentFollowers.filter((followerId) => followerId !== userId),
          },
        },
      });
      return new NextResponse(JSON.stringify(updatedCompany), { status: 200 });
    } else {
      // User is not following, so follow (add userId)
      const updatedCompany = await db.company.update({
        where: {
          id: companyId,
          // Same as above: removed 'userId' if any user can follow
        },
        data: {
          followers: {
            push: userId,
          },
        },
      });
      return new NextResponse(JSON.stringify(updatedCompany), { status: 200 }); // Return 200 on success
    }
    // --- End of Follow/Unfollow Logic ---

  } catch (error) {
    console.error(`[COMPANY_PATCH] : ${error}`); // Use console.error for errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};