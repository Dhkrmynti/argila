import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navigation/Navbar";
import { Footer } from "@/components/Navigation/Footer";
import { VaultBackdrop } from "@/components/vault/VaultBackdrop";
import { ScrollChoreography } from "@/components/vault/ScrollChoreography";
import localFont from "next/font/local";

// Self-hosted so the site never depends on reaching Google Fonts at build or run time
const archivo = localFont({
  src: "../fonts/Archivo-Variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  variable: "--font-archivo",
  display: "swap",
});

const martian = localFont({
  src: "../fonts/MartianMono-Variable-latin.woff2",
  weight: "100 800",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "75% 112.5%" }],
  variable: "--font-martian",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#120E0B",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://argila.xyz"),
  title: "Argila — Staking on Robinhood Chain",
  description: "Argila is a staking protocol on Robinhood Chain. Set USDG in the kiln, draw ARGL every block, and take it back whenever you choose.",
  keywords: ["Argila", "Robinhood Chain", "Staking", "DeFi", "Web3", "Ethereum", "EVM"],
  icons: {
    icon: [
      { url: "/argila-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/argila-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/argila-icon-32.png",
    apple: "/argila-apple-touch.png",
  },
  openGraph: {
    title: "Argila — Staking on Robinhood Chain",
    description: "Argila is a staking protocol on Robinhood Chain. Set USDG in the kiln, draw ARGL every block, and take it back whenever you choose.",
    url: "https://argila.xyz",
    siteName: "Argila",
    images: [
      {
        url: "/og-argila.png",
        width: 1200,
        height: 630,
        alt: "Argila — Staking on Robinhood Chain",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Argila — Staking on Robinhood Chain",
    description: "Argila is a staking protocol on Robinhood Chain. Set USDG in the kiln, draw ARGL every block, and take it back whenever you choose.",
    creator: "@argilaxyz",
    site: "@argilaxyz",
    images: ["/og-argila.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${martian.variable}`}>
      <head>
        <link rel="icon" href="/argila-icon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/argila-apple-touch.png" />
      </head>
      <body className="bg-ink text-paper font-sans antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <Providers>
          <VaultBackdrop />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <ScrollChoreography />
        </Providers>
      </body>
    </html>
  );
}
