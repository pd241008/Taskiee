import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/ui/SideBar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Taskiee | Role-Based Portal",
  description: "A Premium Neobrutalist Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased flex bg-neo-bg selection:bg-neo-purple selection:text-white`}>
        {/* Subtle background texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
             style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        <SideBar />
        <main className="ml-64 w-full min-h-screen relative">{children}</main>
      </body>
    </html>
  );
}
