import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/nunito-sans";
import "./globals.css";

const title = "ELIA Future Readiness Survey Results";
const description = "A situated, privacy-preserving overview of 34 substantive responses from the ELIA higher arts education community.";
const siteUrl = "https://tdufva.github.io/elia-future-readiness-survey-results/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: { icon: `${siteUrl}favicon.svg`, shortcut: `${siteUrl}favicon.svg` },
  openGraph: { title, description, type: "website", siteName: title, url: siteUrl, images: [{ url: `${siteUrl}og.png`, width: 1731, height: 909, alt: "ELIA Future Readiness Survey Results — 34 substantive responses from 17 countries" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}og.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
