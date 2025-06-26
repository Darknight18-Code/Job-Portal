"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Imageupload from "@/components/ui/image-upload";
import { Company } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CoverImageFormProps {
    initialData: Company
    companyId: string;
}

const formSchema = z.object({
    coverImage: z.string().min(1, "coverImage is required").optional().or(z.literal("")),
});

const CoverImageForm = ({ initialData, companyId }: CoverImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coverImage: initialData?.coverImage || "",
        },
    });

    const { isSubmitting } = form.formState;

    const toggleEditing = () => setIsEditing((prev) => !prev);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Image updated successfully");
            toggleEditing();
            router.refresh();
        } catch {
            toast.error("Failed to update image");
        }
    };

    const extractPublicId = (url: string) => {
        const parts = url.split("/");
        const fileName = parts[parts.length - 1];
        return fileName.split(".")[0]; // remove extension
    };

    const handleRemove = async () => {
        const coverImage = form.getValues("coverImage");
        if (!coverImage) return;

        const publicId = extractPublicId(coverImage);
        setIsDeleting(true);

        try {
            await axios.post("/api/cloudinary/delete", { publicId });

            // update in MongoDB by setting coverImage to ""
            await axios.patch(`/api/companies/${companyId}`, { coverImage: "" });

            form.setValue("coverImage", "");
            toast.success("coverImage removed");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove coverImage");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Company Cover Image
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
                </Button>
            </div>

            {!isEditing && (
                !initialData.coverImage ? (
                    <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
                        <ImageIcon className="w-10 h-10 text-neutral-500" />
                    </div>
                ) : (
                    <div className="relative w-full h-60 aspect-video mt-2">
                        <Image
                            alt="coverImage"
                            fill
                            className="w-full h-full object-cover"
                            src={initialData.coverImage}
                        />
                    </div>
                )
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="coverImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Imageupload
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                            onChange={field.onChange}
                                            onRemove={() => form.setValue("coverImage", "")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Save
                            </Button>
                            {form.watch("coverImage") && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleRemove}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Removing..." : "Remove"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default CoverImageForm;
