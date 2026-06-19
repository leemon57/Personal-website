import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { Atmosphere } from "@/components/Atmosphere";
import { CommandPalette, type CommandLink } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile } from "@/lib/profile";
import { navItems } from "@/lib/site";

/**
 * Type system for the "Trust & Authority" minimalist skin (UI/UX Pro Max
 * "Minimalist Portfolio" pairing). Each family is loaded once and exposed as a
 * CSS variable; globals.css maps these to semantic role tokens
 * (--font-display / --font-body / --font-mono):
 *   --font-space      display / headings -> Space Grotesk (distinctive, tight)
 *   --font-archivo    body / long-form   -> Archivo (clean, highly readable)
 *   --font-jetbrains  mono / labels       -> JetBrains Mono (metadata, code)
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const work = await getAllWork();
  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);
  const palettePages: CommandLink[] = [
    { label: "Home", href: "/" },
    ...navItems
      .filter((item) => !item.href.endsWith(".pdf"))
      .map((item) => ({ label: capitalize(item.label), href: item.href })),
  ];
  const paletteProjects: CommandLink[] = work.map((entry) => ({
    label: entry.frontmatter.title,
    href: getCaseStudyHref(entry.frontmatter),
    hint: entry.frontmatter.category,
  }));

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
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
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
        <CommandPalette
          email={profile.email}
          github={profile.github}
          linkedin={profile.linkedin}
          pages={palettePages}
          projects={paletteProjects}
          resume={profile.resume}
        />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
