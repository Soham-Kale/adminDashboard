import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sports Analytics Admin",
    template: "%s | Sports Analytics Admin",
  },
  description: "Subscription analytics admin dashboard for YouInSports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SessionProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
