"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ResumeUpload from "@/components/ui/resume-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Resume type
type Resume = { id?: string; url: string; name: string };

const formSchema = z.object({
  resumes: z
    .object({
      id: z.string().optional(),
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

interface ResumeFormProps {
  initialResumes: Resume[];
  userId: string;
  activeResumeId?: string;
}

const ResumeForm = ({ initialResumes, userId, activeResumeId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeResume, setActiveResume] = useState<string | undefined>(() => activeResumeId);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isSubmitting } = form.formState;
  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}/resumes`, values);
      toast.success("Resumes updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update resumes");
    }
  };

  const handleSetActive = async (resumeId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/resumes/active`, {
        resumeId,
      });
      setActiveResume(resumeId);
      toast.success("Active resume updated");
    } catch {
      toast.error("Failed to set active resume");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4 w-full">
      <div className="font-medium flex items-center justify-between">
        My Resumes
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" /> Edit</>)}
        </Button>
      </div>

      {!isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {form.watch("resumes").map((file) => (
            <div key={file.id||file.url} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col items-center text-center">
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-2">
                {file.url.endsWith(".pdf") ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
                    width="100%"
                    height="100%"
                    className="object-contain"
                  />
                ) : (
                  <img src={file.url} alt={file.name} className="object-contain w-full h-full" />
                )}
              </div>
              <p className="text-sm font-medium truncate w-full">{file.name}</p>
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm border border-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50"
              >
                ⬇️ Download
              </a>
              <button
                onClick={() => handleSetActive(file.id!)}
                className={`mt-2 px-4 py-1 rounded-md text-sm font-semibold shadow-sm transition-colors ${
                  file.id === activeResume ? "bg-green-100 text-green-700 border border-green-600" : "bg-red-100 text-red-700 border border-red-600"
                }`}
              >
                {file.id === activeResume ? "Active" : "Set Active"}
              </button>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ResumeUpload
                      userId={userId}
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(newResume) => {
                        const updated = Array.isArray(newResume)
                          ? [...field.value, ...newResume]
                          : [...field.value, newResume];
                        form.setValue("resumes", updated);
                      }}
                      onRemove={(removeUrl) => {
                        const updated = field.value.filter((r) => r.url !== removeUrl);
                        form.setValue("resumes", updated);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResumeForm;
