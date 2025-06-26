"use client"
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WorkExperienceFormProps {
    initialData:Job;
    jobId: string;
}

const options = [
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

const formSchema  = z.object({
    yearsOfExperience: z.string().min(1),
});

const WorkExperienceForm = ({initialData,jobId} : WorkExperienceFormProps) => {
   const[isEditing, setIsEditing] =  useState(false);
   const router  = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        yearsOfExperience: initialData?.yearsOfExperience || "",
    },
   })

   const {isSubmitting,isValid} = form.formState;

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/jobs/${jobId}`,values);
        toast.success("Job yearsOfExperience updated successfully");
        toggleEditing();
        router.refresh();
        
    } catch (error) {
        toast.error("Something went wrong while updating the job yearsOfExperience");
    }
   };
   const toggleEditing = () => setIsEditing(current => !current);
   const selectedOption = options.find(option => option.value === initialData.yearsOfExperience);
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Work Experience
        <Button onClick={toggleEditing} variant={"ghost"}>
            {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
        </Button>
      </div>

      {/* display the yearsOfExperience */}
      {!isEditing && <p className={cn("text-sm mt-2", !initialData?.yearsOfExperience && "text-neutral-500 italic")}>{selectedOption?.label || "No Experience added"}</p>}

      {/* form to edit the yearsOfExperience */}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render = {({field}) => (
                        <FormItem>
                            <FormControl>
                                <ComboBox
                                    heading="Work Experience"
                                    options={options}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
  )
}

export default WorkExperienceForm
