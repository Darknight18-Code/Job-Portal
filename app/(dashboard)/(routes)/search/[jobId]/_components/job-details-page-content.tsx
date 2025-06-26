"use client"

import { ApplyModal } from "@/components/ui/apply-modal"
import Banner from "@/components/ui/banner"
import Box from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import CustomBreadCrumb from "@/components/ui/custom-bread-crumb"
import Preview from "@/components/ui/preview"
import { Attachment, Company, Job, Resumes, UserProfile } from "@/lib/generated/prisma"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface JobDetailsPageContentProps{
  job : Job & {company : Company | null, attachments : Attachment[]},
  jobId : string,
  userProfile : (UserProfile & {resumes : Resumes[]} ) | null
}


const JobDetailsPageContent = ({job, jobId, userProfile} : JobDetailsPageContentProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router  = useRouter();

  const onApplied = async () => {
    setIsLoading(true)
    try {
      const response = await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`,jobId);

      // send mail to user 

      await axios.post("/api/thankyou/",{
        fullName : userProfile?.fullName,
        email : userProfile?.email
      })

      toast.success("Job Applied")

    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something Went Wrong");
    }finally{
      setOpen(false)
      setIsLoading(false)
      router.refresh()
    }
  }


  return (
    <>

        <ApplyModal 
          isOpen={open} 
          onClose={() => setOpen(false)} 
          onConfirm={onApplied} 
          loading={isLoading} 
          userProfile={userProfile}
        />

        {userProfile && userProfile?.appliedJobs.some(appliedJob => appliedJob.jobId === jobId) && (
          <Banner
            variant={"success"}
            label="Thank You for applying! Your application has recieved, and we are reviewing it carefully. We'll be in touch soon with update."
          />
        )}

      <Box className="mt-4">
        <CustomBreadCrumb breadCrumbItem={[{label : "Search", link : "/search"}]} breadCrumbPage={job?.title !== undefined ? job.title : ""}/>
      </Box>

      {/* job cover image */}
      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? 
          <Image 
            fill
            alt={job.title}
            src={job?.imageUrl}
            className="object-cover"
          />
           : <div className="w-full h-full bg-purple-100 flex items-center justify-center">
            <h2 className="text-3xl font-semibold tracking-wider">{job?.title}</h2>
           </div> }
        </div>
      </Box>

      {/* title and action buttons */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">{job?.title}</h2>
          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2 mt-2">
            {job.company?.logo && (
            <Image 
            width={25}
            height={25}
            alt={job?.company?.name}
            src={job?.company?.logo}
            />
            )}
            <p className="text-muted-foreground text-sm font-semibold">{job?.company?.name}</p>
          </div>
          </Link>
        </div>
        {/* action button */}
        <div>{userProfile ? ( 
          <>
            {!userProfile.appliedJobs.some(appliedJob => appliedJob.jobId === jobId) ? <Button className="text-sm bg-purple-700 hover:bg-purple-900 hover:shadow-md" onClick={() => setOpen(true)}>Apply</Button> : <Button className="text-sm text-purple-700 hover:bg-purple-900 hover:shadow-md" variant={"outline"}> Already Applied</Button>}
          </> 
        ) : ( <Link href={"/user"}>
            <Button className="text-sm px-8 bg-purple-700 border-purple-500 hover:text-white hover:bg-purple-900 hover:shadow-md">Update Profile</Button>
            </Link>
            )}
        </div>
      </Box>

      {/* description */}
      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description :</h2>
        <p className="font-sans">{job?.short_description}</p>
      </Box>

      {job?.description && (
        <Box className="mx-4">
          <Preview value={job?.description}/>
        </Box>
      )}

      {job?.attachments && job?.attachments.length > 0 && (
        <Box className="flex-col my-4 items-start justify-start px-4">
          <h2 className="text-lg font-semibold">Attachments :</h2>
          {job?.attachments.map((item) => {
            const fileExt = item.url.split('.').pop()?.toLowerCase() || "";
            const isImage = ["jpg", "jpeg", "png", "webp"].includes(fileExt);
            const isPreviewableDoc = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileExt);

            return (
              <div
                key={item.id}
                className="mt-4 border rounded-lg p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden text-xs text-gray-600 font-medium">
                    {isImage ? (
                      <Image
                        src={item.url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    ) : isPreviewableDoc ? (
                      <span>{fileExt.toUpperCase()}</span>
                    ) : (
                      <span>FILE</span>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate max-w-xs">{item.name}</p>
                </div>

                <a
                  href={item.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm border border-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50"
                >
                  ⬇️ Download
                </a>
              </div>
            );
          })}
        </Box>
      )}
    </>
  )
}

export default JobDetailsPageContent
