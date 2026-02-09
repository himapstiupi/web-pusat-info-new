import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: {
    template: "%s | HIMA PSTI",
    default: "HIMA PSTI", // Fallback if no title is set in child pages
  },
  description: "Pusat Informasi HIMA PSTI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakartaSans.variable} bg-background-light dark:bg-background-dark text-text-main dark:text-white font-sans min-h-screen flex flex-col overflow-x-hidden antialiased transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
