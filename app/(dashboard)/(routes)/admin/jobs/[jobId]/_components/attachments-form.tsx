"use client";

import AttachmentsUpload from "@/components/ui/attachments-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Job as PrismaJob } from "@/lib/generated/prisma";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Extended type for attachments with optional id
type Attachment = { id?: string; url: string; name: string };
type Job = PrismaJob & { attachments: Attachment[] };

interface AttachmentsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  attachments: z
    .object({
      id: z.string().optional(),
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const initialAttachments = Array.isArray(initialData?.attachments)
    ? initialData.attachments.map((attachment: any) => ({
        id: attachment.id ?? "",
        url: attachment.url ?? "",
        name: attachment.name ?? "",
      }))
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialAttachments,
    },
  });

  const { isSubmitting } = form.formState;

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}/attachments`, values);
      toast.success("Attachments updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update attachments");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {form.watch("attachments").map((file) => (
            <div
              key={file.url}
              className="border rounded-lg p-4 bg-white shadow-sm flex flex-col items-center justify-between text-center"
            >
              {/* Preview */}
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-2">
               {file.url.endsWith(".pdf") ? (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
                      width="100%"
                      height="100%"
                      className="object-contain"
                    />
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="object-contain w-full h-full"
                    />
                )}
              </div>

              {/* Info */}
              <p className="text-sm font-medium truncate w-full">{file.name}</p>
              <p className="text-xs text-gray-500">PDF File</p>

              {/* Download */}
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm border border-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50"
              >
                ⬇️ Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUpload
                      jobId={jobId}
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(newAttachment) => {
                        const updated = Array.isArray(newAttachment)
                          ? [...field.value, ...newAttachment]
                          : [...field.value, newAttachment];
                        form.setValue("attachments", updated);
                      }}
                      onRemove={(removeUrl) => {
                        const updated = field.value.filter(
                          (a) => a.url !== removeUrl
                        );
                        form.setValue("attachments", updated);
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

export default AttachmentsForm;
