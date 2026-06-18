import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandonOS",
  description: "A personal operating system for finances, fitness, and goals.",
};

// Applies the saved theme before first paint to avoid a flash of the default.
const themeInitScript = `(function(){try{var t=localStorage.getItem('brandonos-theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="classic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
