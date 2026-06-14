import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { pageContent } from "@/lib/site";

export const metadata: Metadata = {
  title: pageContent.contact.metadataTitle,
  description: pageContent.contact.metadataDescription,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="layout">
      <article className="contact-page">
        <header className="contact-header">
          <p className="caps">{pageContent.contact.eyebrow}</p>
          <h1>{pageContent.contact.title}</h1>
          <p className="lede muted">{pageContent.contact.lede}</p>
        </header>
        <div data-reveal>
          <ContactForm />
        </div>
      </article>
    </div>
  );
}
