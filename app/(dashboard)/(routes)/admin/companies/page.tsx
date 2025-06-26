import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { columns, CompanyColumns } from "./_components/columns"
import { format } from "date-fns"

const CompaniesOverviewPage = async () => {
    const {userId} = await auth()
    if(!userId){
        return redirect("/")
    }

    const compaines = await db.company.findMany({
        where:{userId},
        orderBy:{createdAt:"desc"},
    });

    const formattedCompanies : CompanyColumns[] = compaines.map(company => ({
      id : company.id,
      name : company.name ? company.name : "",
      logo : company.logo ? company.logo : "",
      createdAt: company.createdAt ? format(company.createdAt.toLocaleDateString(),"MMM do, yyyy") :"N/A",
    }))

  return (
        <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/companies/create"}>
          <Button>
            <Plus className="w-5 h-5 mr-2"/>
            New Company
          </Button>
        </Link>
      </div>

      {/* datatable -> List of jobs */}
      <div className="mt-6">
        <DataTable columns={columns} data={formattedCompanies} searchKey="name" /> 
      </div>
    </div>
  )
}

export default CompaniesOverviewPage
