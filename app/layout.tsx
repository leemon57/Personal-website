import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hanyjiang.com"),
  title: {
    default: "Hany Jiang - Data + ML + Systems",
    template: "%s - Hany Jiang",
  },
  description:
    "Hany Jiang builds full-stack systems and data tools. Data Science at Waterloo, open to Summer 2026 co-op roles.",
  openGraph: {
    title: "Hany Jiang - Data + ML + Systems",
    description:
      "Full-stack systems and data tools by Hany Jiang, Data Science at Waterloo.",
    url: "/",
    siteName: "Hany Jiang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hany Jiang - Data + ML + Systems",
    description:
      "Full-stack systems and data tools by Hany Jiang, Data Science at Waterloo.",
  },
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const themeScript = `
    try {
      var saved = localStorage.getItem('hj-theme');
      var prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = saved || (prefers ? 'dark' : 'light');
    } catch (e) {
      document.documentElement.dataset.theme = 'light';
    }
  `;

  return (
    <html className={`${newsreader.variable} ${jetbrainsMono.variable}`} lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
