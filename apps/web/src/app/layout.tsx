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
      <head>
        {/* reCAPTCHA configuration for invisible mode */}
        <style>{`
          .grecaptcha-badge { 
            visibility: hidden !important; 
            opacity: 0 !important;
            position: fixed !important;
            top: -10000px !important;
            left: -10000px !important;
            z-index: -9999 !important;
            pointer-events: none !important;
          }
          
          /* Ensure no popups appear */
          [role="dialog"][aria-labelledby*="captcha"] {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Hide any reCAPTCHA elements */
          .g-recaptcha,
          .recaptcha-checkbox-border,
          .recaptcha-checkbox-borderAnimation,
          .recaptcha-checkbox-spinner,
          .recaptcha-checkbox-checkmark {
            display: none !important;
            visibility: hidden !important;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
