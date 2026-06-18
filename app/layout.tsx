import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandonOS",
  description: "A personal operating system for finances, fitness, and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
