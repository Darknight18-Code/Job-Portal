"use client"
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ContactFormProps {
    initialData: UserProfile | null
    userId: string;
}

const formSchema  = z.object({
    contact: z.string().min(1, {message :"Contact Number is required"}),
});

const ContactForm = ({initialData,userId} : ContactFormProps) => {
   const[isEditing, setIsEditing] =  useState(false);
   const router  = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        contact : initialData?.contact || ""
    }
   })

   const {isSubmitting,isValid} = form.formState;

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/users/${userId}`,values);
        toast.success("Profile updated successfully");
        toggleEditing();
        router.refresh();
        
    } catch (error) {
        toast.error("Something went wrong while updating the job contact");
    }
   };
   const toggleEditing = () => setIsEditing(current => !current);
  return (
   <Box>
    {!isEditing && (
        <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.contact && "text-n italic")}>
            <UserCircle className="w-4 h-4 mr-2"/>
            {initialData?.contact ? initialData.contact : "No contact"}
        </div>
    )}

     {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 flex-1">
                    <FormField
                    control={form.control}
                    name="contact"
                    render = {({field}) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input 
                                    disabled={isSubmitting}
                                    placeholder="Enter Your Contact No with country code"
                                    {...field}
                                    type="tel"
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

        <Button onClick={toggleEditing} variant={"ghost"}>
            {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
        </Button>
   </Box>
  )
}

export default ContactForm
