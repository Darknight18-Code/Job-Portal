import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    let userProfile;

    if (profile) {
      userProfile = await db.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...values,
        },
      });
    } else {
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log(`[Full_Name_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
