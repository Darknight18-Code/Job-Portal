"use client"

import { Company, Job } from "@/lib/generated/prisma"
import { Card, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import Box from "@/components/ui/box"
import {formatDistanceToNow} from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, BriefcaseBusiness, Currency, Layers, Loader2, Network } from "lucide-react"
import { cn, formattedString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {truncate} from "lodash"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"

interface JobCardItemProps{
    job : Job,
    userId : string |null,

}

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

const JobCardItem = ({job,userId} : JobCardItemProps) => {

    const typeJob = job as Job & {
        company : Company | null
    }

    const company = typeJob.company

    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const isSavedByUser = userId && job.savedUsers?.includes(userId)
    const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;
    const router = useRouter();

    const onClickSaveJob = async () => {
      try {
        setIsBookmarkLoading(true);
        if(isSavedByUser){
          await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`)
          toast.success("Job Removed")
        }else{
          await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`)
          toast.success("Job Saved")
        }
        router.refresh();
      } catch (error) {
        toast.error("Something Went Wrong");
        console.log(`Error : ${(error as Error)?.message}`)
      }finally{
        setIsBookmarkLoading(false);
      }
    }

    const getExperienceLabel = (value : string) =>{
      const experience = experienceData.find(exp => exp.value === value)
      return experience ? experience.label : "N/A"
    }

  return (
    <motion.div layout>
  <Card className="h-full flex flex-col">
    <div className="p-4 flex flex-col gap-y-4 h-full">
      {/* Top Info */}
      <Box className="justify-between items-start">
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
        <Button variant="ghost" size="icon">
          {isBookmarkLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div onClick={onClickSaveJob}>
              <SavedUsersIcon className={cn("w-4 h-4",isSavedByUser ? "text-emerald-500" : "text-muted-foreground")} />
            </div>
          )}
        </Button>
      </Box>

      {/* Company Info */}
      <Box className="items-center gap-x-4">
        <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
          {company?.logo && (
            <Image
              alt={company?.name}
              src={company?.logo}
              width={40}
              height={40}
              className="object-contain"
            />
          )}
        </div>
        <div className="w-full">
          <p className="text-stone-700 font-semibold text-base truncate">
            {job.title}
          </p>
          <Link
            href={`/companies/${company?.id}`}
            className="text-xs text-purple-500 truncate"
          >
            {company?.name}
          </Link>
        </div>
      </Box>

      {/* Job Info */}
      <Box>
        {job.shiftTiming && (
          <div className="text-xs text-muted-foreground flex items-center">
            <BriefcaseBusiness className="w-3 h-3 mr-1" />
            {formattedString(job.shiftTiming)}
          </div>
        )}
        {job.workMode && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            {formattedString(job.workMode)}
          </div>
        )}
        {job.hourlyRate && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Currency className="w-3 h-3 mr-1" />
            {`${formattedString(job.hourlyRate)} $/hr`}
          </div>
        )}
        {job.yearsOfExperience && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Network className="w-3 h-3 mr-1" />
            {getExperienceLabel(job.yearsOfExperience)}
          </div>
        )}
      </Box>

      {/* Short Description */}
      {job.short_description && (
        <CardDescription className="text-xs">
          {truncate(job.short_description, {
            length: 200,
            omission: "...",
          })}
        </CardDescription>
      )}

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mt-2">
            {job.tags.slice(0, 6).map((tag, i) => (
              <p
                key={i}
                className="bg-gray-100 text-xs rounded-md px-2 py-[2px] font-semibold text-neutral-500"
              >
                {tag}
              </p>
            ))}
        </div>


      )}

      {/* Action Buttons Side by Side */}
        <div className="mt-auto flex gap-2 w-full">
        <Link href={`/search/${job.id}`} className="w-1/2">
            <Button
            variant="outline"
            className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
            >
            Details
            </Button>
        </Link>
        <Button
            variant="outline"
            className="w-1/2 text-white bg-purple-800/90 hover:bg-purple-800 hover:text-white cursor-pointer"
            onClick={onClickSaveJob}
        >
            {isSavedByUser ? "Saved" : "Saved For Later"}
        </Button>
        </div>

    </div>
  </Card>
</motion.div>

  )
}

export default JobCardItem
