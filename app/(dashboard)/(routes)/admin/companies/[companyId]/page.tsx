// File: app/(dashboard)/(routes)/admin/companies/[companyId]/page.tsx

import { Metadata } from "next";
import Banner from "@/components/ui/banner";
import IconBadge from "@/components/ui/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import CompanyName from "./name-form";
import CompanyDescriptionForm from "./description-form";
import LogoForm from "./logo-form";
import CompanySocialContactsForm from "./social-contacts-form";
import CoverImageForm from "./cover-image-form";
import CompanyOverviewForm from "./company-overview";
import WhyJoinUsForm from "./why-join-us";

interface PageProps {
  params: {
    companyId: string;
  };
}

export const metadata: Metadata = {
  title: "Edit Company",
};

export default async function CompanyEditPage({ params }: PageProps) {
  const { companyId } = params;

  // Validate format
  if (!/^[0-9a-fA-F]{24}$/.test(companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: { id: companyId, userId },
  });
  if (!company) {
    return redirect("/admin/companies");
  }

  const required = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];
  const completedFields = required.filter(Boolean).length;
  const completionText = `(${completedFields} / ${required.length})`;

  return (
    <div className="p-6">
      <Link href="/admin/companies" className="flex items-center gap-2 text-sm text-neutral-500">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2 mb-4">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">
              Customize Your Company
            </h2>
          </div>
          <CompanyName initialData={company} companyId={company.id} />
          <CompanyDescriptionForm initialData={company} companyId={company.id} />
          <LogoForm initialData={company} companyId={company.id} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2 mb-4">
              <IconBadge icon={Network} />
              <h2 className="text-xl text-neutral-700">
                Company Social Contacts
              </h2>
            </div>
            <CompanySocialContactsForm
              initialData={company}
              companyId={company.id}
            />
            <CoverImageForm initialData={company} companyId={company.id} />
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <CompanyOverviewForm initialData={company} companyId={company.id} />
          <WhyJoinUsForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
}
