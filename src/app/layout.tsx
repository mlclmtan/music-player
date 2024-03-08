import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Malcolm's Music Player",
  description: "Inspired by the Spotify web player, this app is a music player that allows you to play music from your local files. It also has a feature that allows you to search for and play music from the Spotify API. It was built using Next.js, TypeScript, and Ant Design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
