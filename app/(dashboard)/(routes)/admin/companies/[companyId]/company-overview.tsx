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
import { Company, Job } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Editor from "@/components/ui/editor";
import Preview from "@/components/ui/preview";

interface CompanyOverviewFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1, "Overview is required"),
});

const CompanyOverviewForm = ({ initialData, companyId }: CompanyOverviewFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData?.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, {
        overview: values.overview,
      });

      toast.success("Company overview updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while updating the company overview");
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
  if (!roleName ) {
    toast.error("Please provide role name");
    return;
  }

  try {
    setIsPrompting(true);

    const jobPrompt = `Generate a well-structured company overview for "${roleName}" in Markdown format. Include the following sections using proper Markdown headings (##): 

1. ## Introduction – brief description and origin
2. ## Purpose – why the company/platform exists
3. ## Key Features – bullet list of features
4. ## Target Audience – who uses it
5. ## Industry Impact – its influence in the market
6. ## Future Outlook – current status and what's next

Use bullet points where needed, and write in a clear and concise style. Just return valid Markdown.`;
;

    const res = await axios.post("/api/gemini", {
      prompt: jobPrompt,
    });

    if (res.data.result) {
      const cleanedText = cleanMarkdown(res.data.result);

      await form.setValue("overview", cleanedText, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      

      toast.success("AI-generated overview added!");

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
        Company Overview
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
          <Preview value={initialData?.overview || ""} />
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-4">
            <input
              type="text"
              placeholder="e.g Tata Steels"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
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
            Note: Type the company name here to generate overview about company.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div ref={editorRef}>
                        <Editor
                          onChange={field.onChange}
                          initialValue={field.value}
                          placeholder="Enter a detailed company overview..."
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

export default CompanyOverviewForm;
