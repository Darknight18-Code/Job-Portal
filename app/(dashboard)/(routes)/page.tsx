import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import HomeSearchContainer from "../_components/home-search-container";
import Image from "next/image";
import HomeScreenCategoriesContainer from "../_components/home-screen-categories-container";
import HomeCompaniesList from "../_components/home-companies.list";
import RecommendedJobsList from "../_components/recommended-jobs";
import { Footer } from "@/components/ui/footer";


const DashboardHomePage = async() => {

  const {userId} = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy : {name : "asc"}
  });

  const companies = await db.company.findMany({
    where : {
      userId : userId as string
    },
    orderBy : {
      createdAt : "desc"
    }
  })


  return (
    <div className="flex-col py-6 px-4 space-y-24">
      <Box className="flex-col justify-center w-full space-y-4 mt-12">
        <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600">Find your dream job here</h2>
        <p className="text-2xl text-muted-foreground">{jobs.length} + job for you to explore{" "}</p>
      </Box>

      <HomeSearchContainer/>
      <Box className="relative overflow-hidden h-64 justify-center rounded-lg mt-12">
        <Image
          src="/img/banner.jpg"
          alt="Home Banner"
          fill
          className="object-cover"
        />
      </Box>

      <HomeScreenCategoriesContainer categories={categories}/>

      <HomeCompaniesList companies={companies}/>

      <RecommendedJobsList jobs={jobs.splice(0,6)} userId={userId}/>

      <Footer/>
    </div>
  )
}

export default DashboardHomePage
