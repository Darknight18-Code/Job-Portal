import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import CustomBreadCrumb from "@/components/ui/custom-bread-crumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import Image from "next/image";
import CompanyDetailContentPage from "./_components/company-detail-content";


const CompanyDetailPage = async ({params} : {params : Promise<{companyId : string}>}) => {

  const {companyId} = await params;

    const {userId}  = await auth();

    const company = await db.company.findUnique({
        where : {
            id : companyId
        }
    })

    if(!company || !userId){
        redirect("/")
    }

    const jobs = await db.job.findMany({
      where : {
        companyId : companyId
      },
      include :{
        company : true
      },
      orderBy : {
        createdAt : "desc"
      }
    })



  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb breadCrumbItem={[{label : "Search", link : "/search"}]} breadCrumbPage={company?.name !== undefined ? company.name : ""}/>
      </Box>

        {/* company cover image */}
      {company?.coverImage && (
        <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
            <Image
                alt={company?.name}
                src={company?.coverImage}
                fill
                className="object-cover"
            />
        </div>
      )}

      {/* company details */}
      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId}/>
    </div>
  )
}

export default CompanyDetailPage
