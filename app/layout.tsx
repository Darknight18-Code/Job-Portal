import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/providers/toast-provider";

const poppinsFont = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight:["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Job Portal",
  description: "Create your own job portal application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppinsFont.variable} ${geistMono.variable} antialiased h-full`}
        >
          {children}
          <ToastProvider/>
        </body>
      </html>
    </ClerkProvider>
  );
}
