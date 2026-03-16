import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/ui/SideBar";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Taskiee | Role-Based Portal",
  description: "A Neobrutalist Task Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.className} antialiased flex`}>
        <SideBar />
        <main className="ml-64 w-full min-h-screen">{children}</main>
      </body>
    </html>
  );
}
