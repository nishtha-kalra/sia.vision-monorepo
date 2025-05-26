import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIA",
  description: "Reimagining Stories for the New World",
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
