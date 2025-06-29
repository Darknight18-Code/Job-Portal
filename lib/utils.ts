import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Code,
  Monitor,
  Smartphone,
  BarChart,
  Cpu,
  Brain,
  Palette,
  Box,
  Clipboard,
  Shield,
  Terminal,
  Lock,
  Cloud,
  Database,
  Globe,
  FileText,
  DollarSign,
  CreditCard,
  Headphones,
  Users,
  Currency,
  Scale,
  LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formattedString = (input : string) => {
  const parts = input.split("-");

  const capitalize = parts.map(part =>{
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  return capitalize.join(" ");
}


export type IconName =
  | "Software Development"
  | "Web Development"
  | "Mobile App Development"
  | "Data Science"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "UI/UX Design"
  | "Product Management"
  | "Project Management"
  | "Quality Assurance"
  | "DevOps"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Database Administration"
  | "Network Engineering"
  | "Business Analysis"
  | "Sales"
  | "Marketing"
  | "Customer Support"
  | "Human Resources"
  | "Finance"
  | "Accounting"
  | "Legal";

export const iconMapping: Record<IconName, LucideIcon> = {
  "Software Development": Code,
  "Web Development": Monitor,
  "Mobile App Development": Smartphone,
  "Data Science": BarChart,
  "Machine Learning": Cpu,
  "Artificial Intelligence": Brain,
  "UI/UX Design": Palette,
  "Product Management": Box,
  "Project Management": Clipboard,
  "Quality Assurance": Shield,
  DevOps: Terminal,
  Cybersecurity: Lock,
  "Cloud Computing": Cloud,
  "Database Administration": Database,
  "Network Engineering": Globe,
  "Business Analysis": FileText,
  Sales: DollarSign,
  Marketing: CreditCard,
  "Customer Support": Headphones,
  "Human Resources": Users,
  Finance: Currency,
  Accounting: CreditCard,
  Legal: Scale,
};
