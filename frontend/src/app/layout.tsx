import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./_trpc/Provider";
import { Toaster as NormalToaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "../../auth";
import { SessionProvider } from "next-auth/react";
import Modal from "@/features/workspace/components/modals";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(session);
  console.log("login successfully! session:", session);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NormalToaster />
        <Toaster />
        <SessionProvider>
          <Provider>
            <Modal />
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
