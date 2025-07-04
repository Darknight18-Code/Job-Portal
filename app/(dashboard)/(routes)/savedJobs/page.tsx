import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import CustomBreadCrumb from "@/components/ui/custom-bread-crumb";
import SearchContainer from "@/components/ui/search-container";
import { db } from "@/lib/db"; // db is not used here, you can remove this import if not needed elsewhere in this file
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageContent from "../search/_components/page-content";


interface SearchProps{
    // Change searchParams to be a Promise of the object
    searchParams: Promise<{
        title?: string;
        categoryId?: string;
        createdAtFilter?: string;
        shiftTiming?: string;
        workMode?: string;
        yearsOfExperience?: string;
    }>
}

const SavedJobsPage = async({searchParams} : SearchProps) => {

    // Await searchParams here
    const awaitedSearchParams = await searchParams;

    const {userId} = await auth();

    if(!userId){
        redirect("/")
    }

    // Use the awaitedSearchParams
    const jobs = await getJobs({...awaitedSearchParams, savedJobs : true })


    return (
        <div className="flex-col">
            <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
                <CustomBreadCrumb breadCrumbItem={[]} breadCrumbPage="Saved Jobs"/>
            </Box>
            <Box className="w-full h-44 bg-purple-600/20 justify-center">
                <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">Saved Jobs</h2>
            </Box>

            <div className="px-6 pt-6 md:mb-0">
                <SearchContainer/>
            </div>
            <div className="p-4">
                <PageContent jobs={jobs} userId={userId}/>
            </div>
        </div>
    )
}

export default SavedJobsPage