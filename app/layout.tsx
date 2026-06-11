import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { profile } from "@/lib/profile";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl),
  title: {
    default: profile.name,
    template: `%s - ${profile.name}`,
  },
  description: `${profile.name} builds ${profile.focus.toLowerCase()}. ${profile.program} at the ${profile.school}, based in ${profile.location}, and open to ${profile.seeking} roles.`,
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
    <html
      className={`${newsreader.variable} ${jetbrainsMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
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
