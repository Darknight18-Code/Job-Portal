"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Job } from "@/lib/generated/prisma";
import { getGeminiResponse } from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagsFormProps {
    initialData:Job;
    jobId: string;
}

const formSchema  = z.object({
    tags: z.array(z.string()).min(1),
});

const TagsForm = ({initialData,jobId} : TagsFormProps) => {
   const[isEditing, setIsEditing] =  useState(false);
   const[prompt, setPrompt] = useState("");
   const[isprompting, setIsPrompting] = useState(false);
   const[jobTags, setJobTags] = useState<string[]>(initialData.tags);
   const router  = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
   })

   const {isSubmitting,isValid} = form.formState;

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/jobs/${jobId}`,values);
        toast.success("Job tags updated successfully");
        toggleEditing();
        router.refresh();
        
    } catch (error) {
        toast.error("Something went wrong while updating the job tags");
    }
   };
   const toggleEditing = () => setIsEditing(current => !current);
const handlePromptGeneration = async () => {
  try {
    setIsPrompting(true);

    const job_tags = `Generate an array of top 10 to 30 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone in pure JSON format.`;

    const res = await axios.post("/api/gemini", { prompt: job_tags });

    let result = res.data.result;

    if (typeof result === "string") {
      // Remove markdown code block like ```javascript or ```json
      const cleaned = result
        .replace(/^```(?:json|javascript)?\s*/i, '') // remove opening ```
        .replace(/```$/, '')                         // remove closing ```
        .trim();

      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          result = parsed;
        }
      } catch (err) {
        console.warn("❌ JSON parse failed on cleaned result", cleaned);
      }
    }

    if (Array.isArray(result)) {
      console.log("✅ Array of Tags:", result);
      setJobTags((prevTags) => [...prevTags, ...result]);
      toast.success("AI-generated tags added!");
    } else {
      console.warn("🟡 Not an array, raw result:", result);
      toast.error("AI did not return a valid array");
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setIsPrompting(false);
  }
};



const handleTagRemove = (index : number) =>{
  const updatedTags = [...jobTags]
  updatedTags.splice(index,1)
  setJobTags(updatedTags)
}

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button onClick={toggleEditing} variant={"ghost"}>
            {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
        </Button>
      </div>

      {/* display the tags */}
      {!isEditing && 
        <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0? (initialData.tags.map((tag,index) => (
            <div className="text-xs flex items-centergap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>{tag}</div>
          ))) : (<p>No Tags to display</p>)}
        </div>
        }

      {/* form to edit the tags */}
        {isEditing && 
            <>
                <div className="flex items-center gap-2 my-2 ">
                    <input type="text" placeholder="e.g Full Stack Developer" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-2 rounded-md" />
                    {isprompting ? <>
                        <Button><Loader2 className="w-4 h-4 animate-spin"/></Button>
                    </> : <>
                        <Button onClick={handlePromptGeneration}><Lightbulb className="w-4 h-4"/></Button>
                    </>}
                </div>
                <p className="text-sm text-muted-foreground text-right">Note* Profession Name enough to generate Tags</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {jobTags.length > 0 ? (jobTags.map((tag,index) => (
                  <div key={index} className="text-xs flex items-centergap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100">
                    {tag} {isEditing && (
                      <Button variant={"ghost"} className="p-0 h-auto" onClick={() => handleTagRemove(index)}><X className="h-3 w-3"/></Button>
                    )}
                  </div>
                  ))) : <p>No Tags</p>}
                </div>
                <div className="flex items-center gap-2 justify-end mt-4">
                  <Button type="button" variant={"outline"} onClick={() =>{
                    setJobTags([])
                    onSubmit({tags : []})
                  }} disabled={isSubmitting}>Clear All</Button>
                  <Button type="submit" disabled={isSubmitting} onClick={() => onSubmit({tags :jobTags})}>Save</Button>
                </div>
            </>
        }
    </div>
  )
}

export default TagsForm
