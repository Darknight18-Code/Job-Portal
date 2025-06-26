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

interface WhyJoinUsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1, "whyJoinUs is required"),
});

const WhyJoinUsForm = ({ initialData, companyId }: WhyJoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, {
        whyJoinUs: values.whyJoinUs,
      });

      toast.success("Company whyJoinUs updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while updating the company whyJoinUs");
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

    const jobPrompt = `Create a compelling "Why Join Us" content piece for "${roleName}" in Markdown format. The content should be structured using proper Markdown headings (##) and bullet points where applicable. Focus on attracting potential users by highlighting the platform’s unique value.

Please organize the content into the following sections:

1. ## Introduction  
   Briefly introduce "${roleName}" and its mission. Explain what the platform is and who it is for.

2. ## Unique Opportunities  
   Describe the key opportunities "${roleName}" offers—e.g., for music lovers, creators, or professionals in the industry.

3. ## Key Benefits  
   Present a bullet list of top benefits users can expect from joining the platform, such as:
   - Access to an extensive music library  
   - Personalized recommendations  
   - Exclusive or early-release content  
   - Creator tools  
   - Cross-platform compatibility

4. ## Community and Collaboration  
   Highlight community-driven features—forums, live sessions, collaborations, creator-fan interactions, etc.

5. ## Career and Growth Potential  
   Explain how "${roleName}" supports creators and musicians with monetization, exposure, and networking opportunities.

6. ## What Sets Us Apart  
   Clearly explain how "${roleName}" stands out from other music platforms in terms of experience, innovation, or mission.

7. ## Join Us Today  
   End with an engaging call-to-action encouraging users to join and be part of the future of music.

Please ensure the output is in **pure Markdown** format with headings, bullet points, and properly spaced paragraphs.
`;
;

    const res = await axios.post("/api/gemini", {
      prompt: jobPrompt,
    });

    if (res.data.result) {
      const cleanedText = cleanMarkdown(res.data.result);

      await form.setValue("whyJoinUs", cleanedText, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      

      toast.success("AI-generated whyJoinUs added!");

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
        Company Why Join Us
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
          <Preview value={initialData?.whyJoinUs || ""} />
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
            Note: Type the company name here to generate whyJoinUs about company.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="whyJoinUs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div ref={editorRef}>
                        <Editor
                          onChange={field.onChange}
                          initialValue={field.value}
                          placeholder="Enter a detailed company whyJoinUs..."
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

export default WhyJoinUsForm;
