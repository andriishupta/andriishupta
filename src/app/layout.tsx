import {ReactNode} from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {cn} from "@/utils/cn";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Andrii Shupta - Full Stack Expert | andriishupta.dev",
  description: "With 8 years of experience in full-stack web development, I bring expertise in Next.js, React.js, Node.js, and NestJS. Specializing in building efficient and reliable web applications, I focus on SaaS, enterprise, MVPs, and internal projects. Leveraging technologies such as Supabase, TailwindCSS, and serverless architecture, I ensure fast and effective development from scratch, continuous feature delivery, and seamless third-party API integration. Based in Ukraine, I am ready to bring your web application ideas to life remotely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "container mx-auto")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
