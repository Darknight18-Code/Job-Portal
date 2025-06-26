import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the type for the context object for clarity and correctness
interface ContextProps {
  params: {
    companyId: string;
  };
}

export const PATCH = async (
  req: Request,
  context: ContextProps // Correctly type the context argument
) => {
  try {
    const { userId } = await auth();
    const { companyId } = context.params; // No await here, context.params is a plain object

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        followers: true, // Select the followers array to check current state
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    let updatedCompany;

    const isFollowing = company.followers.includes(userId);

    if (isFollowing) {
      // User is already following, so unfollow (remove userId from followers)
      updatedCompany = await db.company.update({
        where: {
          id: companyId,
        },
        data: {
          followers: {
            set: company.followers.filter((followerId) => followerId !== userId),
          },
        },
      });
    } else {
      // User is not following, so follow (add userId to followers)
      updatedCompany = await db.company.update({
        where: {
          id: companyId,
        },
        data: {
          followers: {
            push: userId,
          },
        },
      });
    }

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_FOLLOWER_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};