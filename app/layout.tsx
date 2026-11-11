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
{/* Meta Pixel Code */}
<Script
  id="meta-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=ready;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '2404080556792684');
      fbq('track', 'PageView');
    `,
  }}
/>
      </head>
      <body className="notranslate">
        {children}
      </body>
    </html>
  );
}
