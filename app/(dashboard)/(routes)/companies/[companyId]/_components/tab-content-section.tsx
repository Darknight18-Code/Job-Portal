"use client"

import { Company, Job } from "@/lib/generated/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Preview from "@/components/ui/preview"
import JobsTabContent from "./jobs-tab-content"

interface TabContentSectionProps{
    userId : string | null
    company : Company
    jobs : Job[]
}

const TabContentSection = ({userId,company,jobs} : TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent shadow-none">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-t-0 data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-purple-500 bg-transparent rounded-none text-base font-sans tracking-wide">
                    Overview
                </TabsTrigger>
                <TabsTrigger value="joinus" className="data-[state=active]:border-b-2 data-[state=active]:border-t-0 data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-purple-500 bg-transparent rounded-none text-base font-sans tracking-wide">
                    Why Join Us
                </TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:border-b-2 data-[state=active]:border-t-0 data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-purple-500 bg-transparent rounded-none text-base font-sans tracking-wide">
                    Jobs
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <Preview value={company?.overview ?? ""}/>
            </TabsContent>
            <TabsContent value="joinus">
                <Preview value={company?.whyJoinUs ?? ""}/>
            </TabsContent>
            <TabsContent value="jobs">
                <JobsTabContent jobs={jobs} userId={userId}/>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default TabContentSection
