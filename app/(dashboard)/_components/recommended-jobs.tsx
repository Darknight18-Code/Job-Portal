"use client"

import Box from "@/components/ui/box"
import { Job } from "@/lib/generated/prisma"
import PageContent from "../(routes)/search/_components/page-content"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecommendedJobsListProps{
    jobs : Job[],
    userId : string | null
}

const RecommendedJobsList = ({jobs,userId} : RecommendedJobsListProps) => {
  return (
    <Box className="flex-col justify-center gap-y-4 my-6 mt-12">
        <h2 className="text-2xl font-sans font-bold tracking-wider">Recommended Jobs</h2>
        <div className="mt-4">
            <PageContent jobs={jobs} userId={userId}/>
        </div>

        <Link href={"/search"} className="my-8"> 
            <Button className="w-44 h-12 rounded-xl border-purple-500 text-purple-500 hover:shadow-md hover:bg-transparent" variant={"outline"}>View All Jobs</Button>
        </Link>
    </Box>
  )
}

export default RecommendedJobsList
