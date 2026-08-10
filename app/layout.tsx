import type { Metadata } from "next";
import {
  Archivo,
  JetBrains_Mono,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import { Atmosphere } from "@/components/Atmosphere";
import { AssistantProvider } from "@/components/AssistantProvider";
import { CommandPalette, type CommandLink } from "@/components/CommandPalette";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Sidebar } from "@/components/Sidebar";
import { getAllWork, getCaseStudyHref } from "@/lib/content";
import { profile } from "@/lib/profile";
import { navItems } from "@/lib/site";

/**
 * Type system for the "Serene Bento Portfolio" skin. Each family is loaded once
 * and exposed as a CSS variable; globals.css maps these to semantic role tokens
 * (--font-serif / --font-display / --font-body / --font-mono):
 *   --font-playfair   serif headlines    -> Playfair Display (display serif)
 *   --font-space      display / UI accent -> Space Grotesk (tight geometric)
 *   --font-archivo    body / long-form   -> Archivo (clean, highly readable)
 *   --font-jetbrains  mono / labels       -> JetBrains Mono (metadata, code)
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

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

const siteDescription = `${profile.name} builds ${profile.focus.toLowerCase()}. ${profile.program} at the ${profile.school}, based in ${profile.location}, and open to ${profile.seeking} roles.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl),
  title: {
    default: profile.name,
    template: `%s - ${profile.name}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.name,
    description: siteDescription,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description: siteDescription,
  },
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
  const agentProjects = work.map((entry) => ({
    title: entry.frontmatter.title,
    subtitle: entry.frontmatter.subtitle,
    slug: entry.frontmatter.slug,
    category: entry.frontmatter.category,
    status: entry.frontmatter.status,
    role: entry.frontmatter.role,
    timeline: entry.frontmatter.timeline,
    stack: entry.frontmatter.stack,
    repo: entry.frontmatter.repo,
    demo: entry.frontmatter.demo,
    featured: entry.frontmatter.featured,
    order: entry.frontmatter.order,
  }));

  const themeScript = `
    (function () {
      var root = document.documentElement;
      root.classList.add('js');
      try {
        var saved = localStorage.getItem('hj-theme');
        if (saved === 'light' || saved === 'dark') {
          root.dataset.theme = saved;
        } else {
          root.dataset.theme = 'light';
        }
      } catch (e) {
        root.dataset.theme = 'light';
      }
    })();
  `;

  return (
    <html
      className={`${playfair.variable} ${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
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
        <AssistantProvider>
          <div className="shell">
            <Sidebar />
            <div className="shell-main">
              <main id="main">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
          </div>
          <FloatingAssistant projects={agentProjects} />
        </AssistantProvider>
        <CommandPalette
          email={profile.email}
          github={profile.github}
          linkedin={profile.linkedin}
          pages={palettePages}
          projects={paletteProjects}
          resume={profile.resume}
        />
        <Analytics />
      </body>
    </html>
  );
}
