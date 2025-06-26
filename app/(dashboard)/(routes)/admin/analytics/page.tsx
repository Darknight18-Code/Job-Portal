import { getPieGraphCompanyCreatedByUser, getPieGraphJobCreatedByUser, getTotalCompaniesonPortal, getTotalCompaniesonPortalByUserId, getTotalJobsonPortal, getTotalJobsonPortalByUserId } from "@/actions/get-overview-analytics"
import Box from "@/components/ui/box"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OverviewPieChart from "@/components/ui/overview-piechart"
import { Separator } from "@/components/ui/separator"
import { auth } from "@clerk/nextjs/server"
import { BriefcaseBusiness } from "lucide-react"
import { redirect } from "next/navigation"


const DashboardAnalyticsPage = async () => {

    const {userId} = await auth();
    if(!userId){
        redirect("/")
    }

    const totalJobsOnPortal = await getTotalJobsonPortal();
    const totalJobsOnPortalByUser = await getTotalJobsonPortalByUserId(userId);
    const totalCompaniesOnPortal = await getTotalCompaniesonPortal();
    const totalCompaniesOnPortalByUser = await getTotalCompaniesonPortalByUserId(userId);

    const graphJobTotal = await getPieGraphJobCreatedByUser(userId);
    const graphCompanyTotal = await getPieGraphCompanyCreatedByUser(userId);

    console.log(graphCompanyTotal)


  return (
    <Box className="flex-col items-start p-4">
        <div className="flex flex-col items-start">
            <h2 className="font-sans tracking-wider font-bold text-2xl">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Overview of your Account</p>
        </div>
        <Separator className="my-4"/>

        <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-4">
            {/* total jobs on the portal */}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {totalJobsOnPortal}
                </CardContent>
            </Card>



            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Total Jobs By User</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {totalJobsOnPortalByUser}
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {totalCompaniesOnPortal}
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Total Companies By User</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {totalCompaniesOnPortalByUser}
                </CardContent>
            </Card>

            {/* month wise job count */}
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Month Wise Job Count</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    <OverviewPieChart data={graphJobTotal}/>
                </CardContent>
            </Card>


            {/* moth wise companies count */}
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm font-medium">Month Wise Companies Count</CardTitle>
                    <BriefcaseBusiness className="w-4 h-4" />
                    </div>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    <OverviewPieChart data={graphCompanyTotal}/>
                </CardContent>
            </Card>
        </div>
    </Box>
  )
}

export default DashboardAnalyticsPage
