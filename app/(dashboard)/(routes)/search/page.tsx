import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/ui/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";

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

const SearchPage = async ({searchParams} : SearchProps) => {

    // Await searchParams here
    const awaitedSearchParams = await searchParams;

    const categories = await db.category.findMany({
        orderBy : {
            name : "asc"
        }
    })

    const {userId} = await auth();
    // Use the awaitedSearchParams
    const jobs  = await getJobs({...awaitedSearchParams})


    return (
        <>
            <div className="px-6 pt-6 block md:hidden max-lg:mb-0 ">
                <SearchContainer/>
            </div>

            <div className="p-6">
                {/* categories */}
                <CategoriesList categories={categories}/>

                {/* applied filters */}
                <AppliedFilters categories={categories}/>

                {/* page content */}
                <PageContent jobs={jobs} userId={userId}/>
            </div>
        </>
    )
}

export default SearchPage;