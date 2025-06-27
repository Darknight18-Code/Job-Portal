import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/ui/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";
import { Suspense } from "react";

interface SearchProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  // Await searchParams for Next.js 15
  const awaitedSearchParams = await searchParams;
  
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = await auth();
  const jobs = await getJobs({ ...awaitedSearchParams });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden max-lg:mb-0 ">
        <Suspense fallback={<div>Loading Search...</div>}>
          <SearchContainer />
        </Suspense>
      </div>

      <div className="p-6">
        {/* categories */}
        <CategoriesList categories={categories} />

        {/* applied filters */}
        <Suspense fallback={<div>Loading Filters...</div>}>
          <AppliedFilters categories={categories} />
        </Suspense>

        {/* page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;