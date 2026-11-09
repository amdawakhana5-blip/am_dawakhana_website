import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AM Dawakhana - Herbal Labs",
  description: "Pure Herbs & Unani Solutions",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no" className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
        {/* Direct browser tab icon link */}
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="notranslate">
        {children}
      </body>
    </html>
  );
}