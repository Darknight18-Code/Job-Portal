"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Job } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Editor from "@/components/ui/editor";
import Preview from "@/components/ui/preview";

interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [skills, setSkills] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, {
        description: values.description,
      });

      toast.success("Job description updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while updating the job description");
    }
  };

  function cleanMarkdown(markdown: string) {
  return markdown
    .replace(/^#+\s?/gm, '')     // Remove headings like ##, ###, etc.
    .replace(/^\*\s?/gm, '')     // Remove bullet points
    .replace(/[_*~`>#-]/g, '')   // Remove common markdown characters
    .replace(/\n{2,}/g, '\n')    // Collapse multiple blank lines
    .trim();
}

  const handlePromptGeneration = async () => {
  if (!roleName || !skills) {
    toast.error("Please provide both role name and skills");
    return;
  }

  try {
    setIsPrompting(true);

    const jobPrompt = `Could you please draft a **detailed and well-formatted job requirements document** for the position of **${roleName}**?

The job description should include the following sections:

1. **About the Job** – A short paragraph summarizing the job.
2. **Roles & Responsibilities** – A detailed bullet-point list.
3. **Required Skills** – Mention essential skills, focusing on proficiency in ${skills}.
4. **Preferred/Optional Skills** – Any skills that would be a bonus.
5. **Work Environment** – Mention whether it's remote, hybrid, or in-office.
6. **Salary Range & Benefits** – You may use general placeholders if specifics are unknown.

Please use Markdown formatting with proper line breaks and headings for readability.`;

    const res = await axios.post("/api/gemini", {
      prompt: jobPrompt,
    });

    if (res.data.result) {
      const cleanedText = cleanMarkdown(res.data.result);

      await form.setValue("description", cleanedText, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      

      toast.success("AI-generated description added!");

      // Scroll to editor
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else {
      toast.error("Failed to generate response");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setIsPrompting(false);
  }
};


  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="text-neutral-700 mt-2">
          <Preview value={initialData?.description || ""} />
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-4">
            <input
              type="text"
              placeholder="e.g Full Stack Developer"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-3 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Required Skill Sets"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-3 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
            {isPrompting ? (
              <Button disabled size="sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration} size="sm">
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-right mb-4">
            Note: Profession Name & Required Skills Separated with Comma
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div ref={editorRef}>
                        <Editor
                          onChange={field.onChange}
                          initialValue={field.value}
                          placeholder="Enter a detailed job description..."
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default JobDescription;
