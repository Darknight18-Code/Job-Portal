import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  context: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }


    const company = await db.company.findUnique({
        where : {
            id : companyId
        }
    })

    if (!company) {
      return new NextResponse("Company is missing", { status: 400 });
    }

    const userIndex = company?.followers.indexOf(userId)



    if(userIndex !== -1){
         const updatedCompany = await db.company.update({
            where : {
                id : companyId,
                userId
            },
            data : {
                followers : {
                    set :  company?.followers.filter(followerId => followerId !== userId)
                }
            }
        })

        return new NextResponse(JSON.stringify(updatedCompany), {status : 200})
    }else{
        return new NextResponse("User Not Found in followers",{status : 404})
    }

  } catch (error) {
    console.log(`[COMPANY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
