import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  // Cast the context argument to 'any' to bypass type checking for it
  context: any // TEMPORARY WORKAROUND: Cast to any to bypass strict type checking
) => {
  try {
    const { userId } = await auth();
    // Safely extract companyId, relying on runtime structure
    const companyId = context.params?.companyId as string;

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
        followers: true,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    let updatedCompany;

    const isFollowing = company.followers.includes(userId);

    if (isFollowing) {
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