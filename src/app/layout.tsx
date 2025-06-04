import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIA - Reimagining Stories for the New World",
  description: "co-built with AI. owned by You.",
  icons: {
    icon: [
      {
        url: "/favicon.ico?v=2",
        sizes: "any",
      },
      {
        url: "/favicon.svg?v=2",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/favicon.svg?v=2",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
