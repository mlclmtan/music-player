import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Malcolm's Music Player",
  description: "Inspired by the Spotify web player, this app is a music player that allows you to play music. It was built using Next.js, TypeScript, and Ant Design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          {children}
          <Analytics />
        </AntdRegistry>
      </body>
    </html>
  );
}
