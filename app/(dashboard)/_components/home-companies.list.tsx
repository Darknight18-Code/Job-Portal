"use client"

import Box from "@/components/ui/box"
import { Card } from "@/components/ui/card"
import { Company } from "@/lib/generated/prisma"
import { useRouter } from "next/navigation"

interface HomeCompaniesListProps{
    companies : Company[]
}

const CompanyListItemCard = ({company} : {company : Company}) => {

    const router = useRouter();


    return(
        <Card className="p-4 flex items-center gap-2 text-muted-foreground hover:text-purple-500 hover:border-purple-500 shadow-md cursor-pointer" onClick={() => router.push(`/companies/${company.id}`)}>
            <h2 className="font-serif font-semibold tracking-wider whitespace-nowrap">{company.name}</h2>
        </Card>
    )
}

const HomeCompaniesList = ({companies} : HomeCompaniesListProps) => {
  return (
    <Box className="flex-col my-12">
        <h2 className="text-2xl tracking-wider font-bold font-sans">Featured companies actively hiring</h2>
        <div className="mt-12 w-fullflex items-center justify-center flex-wrap gap-4">
            {companies.map(item => (
                <CompanyListItemCard company={item} key={item.id}/>
            ))}
        </div>
    </Box>
  )
}

export default HomeCompaniesList
