import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { profile } from "@/lib/profile";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
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
    (function () {
      var root = document.documentElement;
      root.classList.add('js');
      try {
        var saved = localStorage.getItem('hj-theme');
        root.dataset.theme = saved || 'dark';
      } catch (e) {
        root.dataset.theme = 'dark';
      }
    })();
  `;

  return (
    <html
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Atmosphere />
        <ScrollReveal />
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
