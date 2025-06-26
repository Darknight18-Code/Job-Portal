"use client"

import Box from "@/components/ui/box"
import { Card } from "@/components/ui/card"
import { Category } from "@/lib/generated/prisma"
import { iconMapping, IconName } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import qs from "query-string"

interface HomeScreenCategoriesContainerProps{
    categories : Category[]
}

export const Icon = ({name} : {name : IconName}) => {
    const IconComponent = iconMapping[name]

    return IconComponent ? <IconComponent className="w-5 h-5"/> : null
}

export const CategoryListItemCard = ({data} : {data : Category}) => {

    const router = useRouter();

    const handleClick = (categoryId : string) => {
        const href = qs.stringifyUrl({
            url : "/search",
            query : {
                categoryId : categoryId || undefined,
            },
        });
        router.push(href);
    }


    return(
        <Card className="!flex-row flex items-center justify-between w-48 px-3 py-2 gap-2 text-muted-foreground hover:text-purple-500 hover:border-purple-500 hover:shadow-md cursor-pointer">
  <div className="flex items-center gap-2 overflow-hidden" onClick={() => handleClick(data.id)}>
    <Icon name={data.name as IconName} />
    <span className="truncate whitespace-nowrap">{data.name}</span>
  </div>
  <ChevronRight className="w-4 h-4 flex-shrink-0" />
</Card>

    )
}

const HomeScreenCategoriesContainer = ({categories} : HomeScreenCategoriesContainerProps) => {
  return (
    <Box className="flex-col mt-12">
        <div className="w-full flex flex-wrap items-center justify-center gap-4">
            {categories.map(item =>(
                <CategoryListItemCard key={item.id} data={item}/>
            ))}
        </div>
    </Box>
  )
}

export default HomeScreenCategoriesContainer
