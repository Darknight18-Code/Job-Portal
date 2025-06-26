"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
    disabled: boolean;
    jobId: string;
    isPublished: boolean;
}

const JobPublishAction = ({disabled,jobId,isPublished} : JobPublishActionProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
      try {
        setIsLoading(true);
        if(isPublished){
          await axios.patch(`/api/jobs/${jobId}/unpublish`);
          toast.success("Job UnPublished");
        }else{
          await axios.patch(`/api/jobs/${jobId}/publish`);
          toast.success("Job Published");
        }

        router.refresh();
      } catch (error) {
        toast.error("Something Went Wrong");
        console.log((error as Error) ?.message);
      }finally{
        setIsLoading(false);
      }
    }

    const onDelete = async () => {
  try {
    setIsLoading(true);
    await axios.delete(`/api/jobs/${jobId}/delete`);
    toast.success("Job deleted");
    router.push("/admin/jobs"); // Redirect after deletion
  } catch (error) {
    toast.error("Failed to delete job");
    console.error("Delete error:", (error as Error).message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center gap-x-3">
      <Button variant={"outline"} disabled={disabled || isLoading} size={"sm"} onClick={onClick}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button variant={"destructive"} size={"icon"} disabled={isLoading} onClick={onDelete}>
        <TrashIcon className="w-4 h-4"/>
      </Button>
    </div>
  )
}

export default JobPublishAction
