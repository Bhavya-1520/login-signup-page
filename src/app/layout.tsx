import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loom & Bloom Studio | Handcrafted Permanent Bouquets",
  description: "Beautiful handcrafted satin ribbon and pipe cleaner bouquets that last forever. Perfect gifts for every occasion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
