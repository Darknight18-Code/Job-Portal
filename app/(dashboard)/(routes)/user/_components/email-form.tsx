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

interface EmailFormProps {
    initialData: UserProfile | null
    userId: string;
}

const formSchema  = z.object({
    email: z.string().min(1, {message :"Email is required"}),
});

const EmailForm = ({initialData,userId} : EmailFormProps) => {
   const[isEditing, setIsEditing] =  useState(false);
   const router  = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email : initialData?.email || ""
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
        toast.error("Something went wrong while updating the job email");
    }
   };
   const toggleEditing = () => setIsEditing(current => !current);
  return (
   <Box>
    {!isEditing && (
        <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.email && "text-n italic")}>
            <UserCircle className="w-4 h-4 mr-2"/>
            {initialData?.email ? initialData.email : "No Email"}
        </div>
    )}

     {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 flex-1">
                    <FormField
                    control={form.control}
                    name="email"
                    render = {({field}) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input 
                                    disabled={isSubmitting}
                                    placeholder="Enter Your Mail e.g. mail@sample.com"
                                    {...field}
                                    type="email"
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

export default EmailForm
