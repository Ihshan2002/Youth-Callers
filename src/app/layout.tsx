import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youth Callers | Noble Community Platform",
  description: "An ultra-secure, anonymous community platform for seeking knowledge and verified solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="hidden md:block">
            <Navbar />
          </div>
          <main className="flex-1 flex flex-col pb-24 md:pb-0 relative z-0 overflow-x-hidden">
            {children}
          </main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
