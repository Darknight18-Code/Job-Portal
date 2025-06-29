"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"
import { BadgeCheck, Ban, Eye, Loader, Loader2, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

interface CellActionsProps{
    id :string;
    fullName : string;
    email : string;
}

const CellActions = ({id,fullName,email} : CellActionsProps) => {

    const[isLoading, setIsLoading] = useState(false)
    const[isRejection, setIsRejection] = useState(false)

    const sendSelected = async () => {
        setIsLoading(true);
        try {
            await axios.post("/api/sendSelected",{email,fullName})
            toast.success("Mail Sent")
            setIsLoading(false); 
        } catch (error) {
            toast.error("Something Went wrong");
        }
    }

    const sendRejected = async () => {
         setIsRejection(true);
        try {
            await axios.post("/api/sendRejection",{email,fullName})
            toast.success("Mail Sent")
            setIsRejection(false); 
        } catch (error) {
            toast.error("Something Went wrong");
        }
    }


  return (
     <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}><MoreHorizontal className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                   {isLoading ? (
                    <DropdownMenuItem className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                    </DropdownMenuItem>
                   ) : <DropdownMenuItem onClick={sendSelected} className="flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 mr-2"/>
                        Selected
                    </DropdownMenuItem>
                    }
                    {isRejection ? (
                    <DropdownMenuItem className="flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin"/>
                    </DropdownMenuItem>
                   ) : <DropdownMenuItem onClick={sendRejected} className="flex items-center justify-center">
                        <Ban className="w-4 h-4 mr-2"/>
                        Rejected
                    </DropdownMenuItem>
                    }
                </DropdownMenuContent>
        </DropdownMenu>
  )
}

export default CellActions
