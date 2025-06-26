"use client";

import { cn } from "@/lib/utils";

interface PreviewProps {
  value: string;
  className?: string;
}

export default function Preview({ value, className }: PreviewProps) {
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:font-semibold prose-headings:text-gray-900",
        "prose-p:text-gray-700 prose-p:leading-relaxed",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-gray-900 prose-strong:font-semibold",
        "prose-ul:my-2 prose-ol:my-2",
        "prose-li:my-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: value || "No description provided." }}
    />
  );
}